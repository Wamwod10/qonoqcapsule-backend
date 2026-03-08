import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import crypto from "crypto";
import axios from "axios";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import pkg from "pg";

dotenv.config();

const { Pool } = pkg;

/* ================= APP ================= */

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["https://qonoqcapsule.uz", "http://localhost:5173"],
  }),
);

app.use(express.json());

/* ================= PATH FIX ================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ================= DATABASE ================= */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      branch TEXT,
      "capsuleType" TEXT,
      date TEXT,
      time TEXT,
      duration INTEGER,
      "createdAt" TEXT
    )
  `);

  console.log("✅ PostgreSQL connected");
}

initDB().catch((err) => {
  console.error("DB ERROR:", err);
  process.exit(1);
});

/* ================= TEST ================= */

app.get("/", (req, res) => {
  res.send("Backend working ✅");
});

/* ================= EMAIL ================= */

const mailTransporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ================= HELPERS ================= */

function toDateTime(date, time) {
  return new Date(`${date}T${time}:00`);
}

function cleanPhone(phone) {
  return String(phone).replace(/\D/g, "");
}

async function checkAvailability({
  branch,
  capsuleType,
  date,
  time,
  duration,
}) {
  const limit = capsuleType === "family" ? 2 : 4;

  const reqStart = toDateTime(date, time);
  const reqEnd = new Date(reqStart.getTime() + Number(duration) * 3600000);

  const result = await pool.query(
    `SELECT * FROM bookings WHERE branch=$1 AND "capsuleType"=$2`,
    [branch, capsuleType],
  );

  const overlaps = result.rows.filter((b) => {
    const bStart = toDateTime(b.date, b.time);
    const bEnd = new Date(bStart.getTime() + Number(b.duration) * 3600000);

    return reqStart < bEnd && reqEnd > bStart;
  });

  if (overlaps.length < limit) return { available: true };

  const nextFree = new Date(
    Math.min(
      ...overlaps.map((b) => {
        const s = toDateTime(b.date, b.time);
        return s.getTime() + Number(b.duration) * 3600000;
      }),
    ),
  );

  return {
    available: false,
    nextTime: nextFree.toTimeString().slice(0, 5),
    nextDay: nextFree.toDateString() !== reqStart.toDateString(),
  };
}

/* ================= BOOKINGS ================= */

app.get("/api/bookings", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM bookings ORDER BY date,time`,
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

app.post("/api/bookings", async (req, res) => {
  const { branch, capsuleType, date, time, duration } = req.body;

  if (!branch || !capsuleType || !date || !time || !duration) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const avail = await checkAvailability({
      branch,
      capsuleType,
      date,
      time,
      duration,
    });

    if (!avail.available) {
      return res.status(409).json(avail);
    }

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    await pool.query(`INSERT INTO bookings VALUES ($1,$2,$3,$4,$5,$6,$7)`, [
      id,
      branch,
      capsuleType,
      date,
      time,
      duration,
      createdAt,
    ]);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Insert failed" });
  }
});

app.delete("/api/bookings/:id", async (req, res) => {
  try {
    await pool.query(`DELETE FROM bookings WHERE id=$1`, [req.params.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
});

/* ================= PAYMENT ================= */

app.post("/api/create-payment", async (req, res) => {
  try {
    const { amount, bookings, phone, email } = req.body;

    if (!amount || !bookings?.length) {
      return res.status(400).json({ error: "Invalid data" });
    }

    const orderId = crypto.randomUUID();

    const payload = {
      octo_shop_id: Number(process.env.OCTO_SHOP_ID),
      octo_secret: process.env.OCTO_SECRET,
      shop_transaction_id: orderId,
      auto_capture: true,
      test: true,

      init_time: new Date().toISOString().slice(0, 19).replace("T", " "),

      total_sum: Number(amount),
      currency: "UZS",

      description: "Qonoq Capsule Booking",

      basket: bookings.map((b) => ({
        name: "Capsule booking",
        quantity: 1,
        price: Number(b.price),
      })),

      user_data: {
        user_id: orderId,
        phone: cleanPhone(phone),
        email: email || "",
      },

      payment_methods: [
        { method: "bank_card" },
        { method: "uzcard" },
        { method: "humo" },
      ],

      return_url: "https://qonoqcapsule.uz/success",

      notify_url: "https://qonoqcapsule-backend.onrender.com/api/octo-callback",

      language: "uz",
      ttl: 15,
    };

    const response = await axios.post(
      "https://secure.octo.uz/prepare_payment",
      payload,
    );

    const data = response.data;

    if (data.error !== 0) {
      return res.status(500).json(data);
    }

    res.json({
      paymentUrl: data.data.octo_pay_url,
      paymentId: data.data.octo_payment_UUID,
      orderId,
    });
  } catch (err) {
    console.error("OCTO ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Payment failed" });
  }
});

/* ================= PAYMENT CALLBACK ================= */

app.post("/api/octo-callback", (req, res) => {
  console.log("OCTO CALLBACK:", req.body);
  res.json({ status: "ok" });
});

/* ================= TELEGRAM CONTACT ================= */

app.post("/notify/telegram", async (req, res) => {
  try {
    const url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;

    await axios.post(url, {
      chat_id: process.env.CHAT_ID,
      text: req.body.text,
    });

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

/* ================= TELEGRAM BOOKING ================= */

app.post("/notify/booking", async (req, res) => {
  try {
    const { booking } = req.body;

    let chatId = process.env.CHAT_ID;

    if (booking.locationLabel === "sam") {
      chatId = process.env.CHAT_ID_S;
    }

    const locationName =
      booking.locationLabel === "sam" ? "Samarkand Station" : "Tashkent Airport";

    const text = `📢 Yangi bron qabul qilindi

👤 Ism: ${booking.name}
📧 Email: ${booking.email}
📞 Telefon: ${booking.phone}

📍 Filial: ${booking.locationLabel} 
🗓 Bron vaqti: ${booking.bookedAt}
📅 Kirish sanasi: ${booking.checkInDate}
⏰ Kirish vaqti: ${booking.checkInTime}
🛏 Xona: ${booking.room}
📆 Davomiylik: ${booking.duration}
💶 Narx: ${booking.price}

❕ @freemustafa Send an Invoice to the guest!
✅ Mijoz kelganda, mavjud bo‘lgan ixtiyoriy bo‘sh kapsulaga joylashtiriladi
🌐 Sayt: qonoqcapsule.uz`;

    const url = `https://api.telegram.org/bot${process.env.BOOKING_BOT_TOKEN}/sendMessage`;

    await axios.post(url, {
      chat_id: chatId,
      text,
    });

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

/* ================= EMAIL ================= */

app.post("/notify/email", async (req, res) => {
  try {
    const { booking } = req.body;

    await mailTransporter.sendMail({
      from: `"Qonoq Capsule" <${process.env.EMAIL_USER}>`,
      to: booking.email,
      subject: "Bron tasdiqlandi",
      text: `Booking confirmed

${booking.checkInDate} ${booking.checkInTime}
${booking.duration}`,
    });

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

/* ================= START ================= */

app.listen(PORT, () => {
  console.log("🚀 Server good running on", PORT);
});
