import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import sqlite3 from "sqlite3";
import crypto from "crypto";
import axios from "axios";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

dotenv.config();

/* ================= APP ================= */

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["https://qonoqcapsule.uz", "http://localhost:5173"],
  }),
);
app.use(express.json());

/* ================= PATH FIX (ES MODULE) ================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ================= DB ================= */

const DB_PATH = path.join(__dirname, "bookings.db");
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) console.error("DB ERROR:", err.message);
  else console.log("✅ SQLite connected");
});

db.run(`
  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    branch TEXT,
    capsuleType TEXT,
    date TEXT,
    time TEXT,
    duration INTEGER,
    createdAt TEXT
  )
`);

/* ================= TEST ================= */

app.get("/", (req, res) => {
  res.send("Backend is working ✅");
});

/* ================= EMAIL TRANSPORTER ================= */

const mailTransporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ================= BOOKINGS ================= */

app.get("/api/bookings", (req, res) => {
  db.all("SELECT * FROM bookings ORDER BY date, time", [], (err, rows) => {
    if (err) {
      console.error("DB GET ERROR:", err);
      return res.status(500).json({ error: "DB error" });
    }
    res.json(rows);
  });
});

app.post("/api/bookings", (req, res) => {
  const { branch, capsuleType, date, time, duration } = req.body;

  if (!branch || !capsuleType || !date || !time || !duration) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  db.run(
    `INSERT INTO bookings (id, branch, capsuleType, date, time, duration, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, branch, capsuleType, date, time, Number(duration), createdAt],
    function (err) {
      if (err) {
        console.error("DB INSERT ERROR:", err);
        return res.status(500).json({ error: "Insert failed" });
      }

      res.json({
        success: true,
        booking: { id, branch, capsuleType, date, time, duration, createdAt },
      });
    },
  );
});

app.delete("/api/bookings/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM bookings WHERE id = ?", [id], function (err) {
    if (err) {
      console.error("DB DELETE ERROR:", err);
      return res.status(500).json({ error: "Delete failed" });
    }

    res.json({ success: true });
  });
});

/* ================= AVAILABILITY ================= */

/* ================= AVAILABILITY ================= */

function toDateTime(date, time) {
  return new Date(`${date}T${time}:00`);
}

app.post("/api/check-availability", (req, res) => {
  const { branch, capsuleType, date, time, duration } = req.body;

  if (!branch || !capsuleType || !date || !time || !duration) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // capacity
  const limit = capsuleType === "family" ? 2 : 4;

  const reqStart = toDateTime(date, time);
  const reqEnd = new Date(
    reqStart.getTime() + Number(duration) * 60 * 60 * 1000,
  );

  db.all(
    `SELECT * FROM bookings WHERE branch=? AND capsuleType=?`,
    [branch, capsuleType],
    (err, rows) => {
      if (err) {
        console.error("AVAIL DB ERROR:", err);
        return res.status(500).json({ error: "DB error" });
      }

      const overlaps = rows.filter((b) => {
        const bStart = toDateTime(b.date, b.time);
        const bEnd = new Date(
          bStart.getTime() + Number(b.duration) * 60 * 60 * 1000,
        );

        // overlap rule
        return reqStart < bEnd && reqEnd > bStart;
      });

      if (overlaps.length < limit) {
        return res.json({ available: true });
      }

      // nearest free time
      const nextFreeDate = new Date(
        Math.min(
          ...overlaps.map((b) => {
            const s = toDateTime(b.date, b.time);
            return s.getTime() + Number(b.duration) * 60 * 60 * 1000;
          }),
        ),
      );

      const hh = String(nextFreeDate.getHours()).padStart(2, "0");
      const mm = String(nextFreeDate.getMinutes()).padStart(2, "0");

      const nextDay = nextFreeDate.toDateString() !== reqStart.toDateString();

      return res.json({
        available: false,
        nextTime: `${hh}:${mm}`,
        nextDay,
      });
    },
  );
});

/* ================= OCTO PAYMENT ================= */

app.post("/api/create-payment", async (req, res) => {
  try {
    const { amount, bookings } = req.body;

    if (!amount || !bookings || !bookings.length) {
      return res.status(400).json({ error: "Amount & bookings required" });
    }

    const orderId = crypto.randomUUID();

    const payload = {
      octo_shop_id: Number(process.env.OCTO_SHOP_ID),
      octo_secret: process.env.OCTO_SECRET,
      shop_transaction_id: orderId,
      auto_capture: true,
      test: false,
      init_time: new Date().toISOString().slice(0, 19).replace("T", " "),
      total_sum: Number(amount),
      currency: "UZS",
      description: "Qonoq Capsule Booking",
      basket: bookings.map((b) => ({
        position_desc: `${b.capsuleTypeValue} | ${b.checkIn} ${b.checkInTime}`,
        count: 1,
        price: Number(b.price),
      })),
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
      { headers: { "Content-Type": "application/json" } },
    );

    const data = response.data;

    if (data.error !== 0) {
      console.error("OCTO ERROR:", data);
      return res.status(500).json({ error: data.errMessage || "Octo error" });
    }

    res.json({
      paymentUrl: data.data.octo_pay_url,
      octoPaymentId: data.data.octo_payment_UUID,
      orderId,
    });
  } catch (err) {
    console.error("OCTO PAY ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Payment create failed" });
  }
});

app.post("/api/octo-callback", (req, res) => {
  console.log("✅ OCTO CALLBACK:", req.body);
  res.json({ status: "ok" });
});

/* ================= TELEGRAM CONTACT BOT ================= */

app.post("/notify/telegram", async (req, res) => {
  try {
    const { text } = req.body;

    const url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;

    await axios.post(url, {
      chat_id: process.env.CHAT_ID,
      text,
    });

    res.json({ success: true });
  } catch (error) {
    console.log(
      "TELEGRAM CONTACT ERROR:",
      error.response?.data || error.message,
    );
    res.status(500).json({ success: false });
  }
});

/* ================= TELEGRAM BOOKING BOT ================= */

app.post("/notify/booking", async (req, res) => {
  try {
    const { booking } = req.body;

    const text = `📢 Yangi bron qabul qilindi

👤 Ism: ${booking.name}
📧 Email: ${booking.email}
📞 Telefon: ${booking.phone}

🗓 Kirish: ${booking.checkIn}
⏰ Chiqish: ${booking.checkOut}
🛏 Xona: ${booking.room}
💶 Narx: ${booking.price}`;

    const url = `https://api.telegram.org/bot${process.env.BOOKING_BOT_TOKEN}/sendMessage`;

    await axios.post(url, {
      chat_id: process.env.BOOKING_CHAT_ID,
      text,
    });

    res.json({ success: true });
  } catch (err) {
    console.log("TELEGRAM BOOKING ERROR:", err.response?.data || err.message);
    res.status(500).json({ success: false });
  }
});

/* ================= EMAIL TO USER ================= */

app.post("/notify/email", async (req, res) => {
  try {
    const { booking } = req.body;

    if (!booking || !booking.email) {
      return res.status(400).json({ error: "Email not provided" });
    }

    const text = `
Bron tasdiqlandi ✅

Ism: ${booking.name}
Email: ${booking.email}
Telefon: ${booking.phone}

Kirish: ${booking.checkIn}
Chiqish: ${booking.checkOut}
Xona: ${booking.room}
Narx: ${booking.price}
`;

    await mailTransporter.sendMail({
      from: `"Qonoq Capsule" <${process.env.EMAIL_USER}>`,
      to: booking.email,
      subject: "Bron tasdiqlandi",
      text,
    });

    res.json({ success: true });
  } catch (err) {
    console.log("EMAIL ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/* ================= START ================= */

app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
