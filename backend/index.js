import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";
import axios from "axios";
import { fileURLToPath } from "url";
import path from "path";
import nodemailer from "nodemailer";
import pkg from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.join(__dirname, ".env") });

const { Pool } = pkg;

const TELEGRAM_CHAT_IDS = {
  airport: process.env.CHAT_ID_AIRPORT || "-1003037735123",
  city: process.env.CHAT_ID_CITY || "-1003824094612",
  north: process.env.CHAT_ID_NORTH || "-1003345024745",
  samarkand_airport: process.env.CHAT_ID_CITY || "-1003824094612",
  samarkand_railway: process.env.CHAT_ID_NORTH || "-1003345024745",
  tashkent_airport: process.env.CHAT_ID_AIRPORT || "-1003037735123",
};

const normalizeTelegramBranch = (branch) =>
  String(branch || "")
    .trim()
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const getTelegramChatIdForBranch = (branch) => {
  const normalizedBranch = normalizeTelegramBranch(branch);
  const branchKeyMap = {
    airport: "airport",
    tas: "airport",
    tashkent: "airport",
    tashkent_airport: "airport",
    toshkent_aeroporti: "airport",
    toshkent_xalqaro_aeroporti: "airport",
    samarkand_airport: "city",
    samarqand_aeroporti: "city",
    samarqand_xalqaro_aeroporti: "city",
    sam_air: "city",
    city: "city",
    buh: "city",
    samarkand_railway: "north",
    samarkand_railway_station: "north",
    samarqand_temir_yo_l_vokzali: "north",
    samarqand_temir_yol_vokzali: "north",
    samarqand_temir_yo_l_vokzali_qonoq_kapsulasi: "north",
    samarqand_temir_yol_vokzali_qonoq_kapsulasi: "north",
    sam_rail: "north",
    sam: "north",
    north: "north",
  };

  const mappedKey = branchKeyMap[normalizedBranch] || normalizedBranch;
  return TELEGRAM_CHAT_IDS[mappedKey] || process.env.CHAT_ID;
};

const getTelegramContactChatIdForBranch = (branch) => {
  const normalizedBranch = normalizeTelegramBranch(branch);
  const branchKeyMap = {
    airport: "airport",
    tas: "airport",
    tashkent: "airport",
    tashkent_airport: "airport",
    toshkent_aeroporti: "airport",
    toshkent_xalqaro_aeroporti: "airport",
    samarkand_airport: "city",
    samarqand_aeroporti: "city",
    samarqand_xalqaro_aeroporti: "city",
    sam_air: "city",
    city: "city",
    buh: "city",
    samarkand_railway: "north",
    samarkand_railway_station: "north",
    samarqand_temir_yo_l_vokzali: "north",
    samarqand_temir_yol_vokzali: "north",
    sam_rail: "north",
    sam: "north",
    north: "north",
  };

  const mappedKey = branchKeyMap[normalizedBranch] || normalizedBranch;
  return TELEGRAM_CHAT_IDS[mappedKey];
};

const inferTelegramBranchFromText = (text) => {
  const value = String(text || "").toLowerCase();

  if (value.includes("railway") || value.includes("temir") || value.includes("vokzal")) {
    return "samarkand_railway";
  }

  if (value.includes("samarkand airport") || value.includes("samarqand aeroport")) {
    return "samarkand_airport";
  }

  if (value.includes("tashkent") || value.includes("toshkent")) {
    return "tashkent_airport";
  }

  return "";
};

const getTelegramContactBranch = (body) =>
  body.branch ||
  body.branchKey ||
  body.location ||
  body.locationLabel ||
  inferTelegramBranchFromText(body.text);

const buildTelegramContactText = (body) => {
  if (!body.fullName && !body.email && !body.phone && !body.message) {
    return body.text || "";
  }

  const branchLabel = getTelegramBranchLabel(body.branch || body.branchLabel);

  return `📩 Yangi xabar:
👤 Ism: ${body.fullName || ""}
📧 Email: ${body.email || ""}
📞 Telefon: ${body.phone || ""}
📍 Filial: ${branchLabel}
💬 Aloqa usuli: ${body.method || ""}
📝 Xabar: ${body.message || ""}`;
};

const getTelegramBranchLabel = (branch) => {
  const normalizedBranch = normalizeTelegramBranch(branch);
  const branchLabelMap = {
    airport: "Tashkent Airport",
    tas: "Tashkent Airport",
    tashkent: "Tashkent Airport",
    tashkent_airport: "Tashkent Airport",
    toshkent_aeroporti: "Tashkent Airport",
    toshkent_xalqaro_aeroporti: "Tashkent Airport",
    city: "Samarkand Airport",
    buh: "Samarkand Airport",
    sam_air: "Samarkand Airport",
    samarkand_airport: "Samarkand Airport",
    samarqand_aeroporti: "Samarkand Airport",
    samarqand_xalqaro_aeroporti: "Samarkand Airport",
    north: "Samarkand Railway",
    sam: "Samarkand Railway",
    sam_rail: "Samarkand Railway",
    samarkand_railway: "Samarkand Railway",
    samarkand_railway_station: "Samarkand Railway",
    samarqand_temir_yo_l_vokzali: "Samarkand Railway",
    samarqand_temir_yol_vokzali: "Samarkand Railway",
    samarqand_temir_yo_l_vokzali_qonoq_kapsulasi: "Samarkand Railway",
    samarqand_temir_yol_vokzali_qonoq_kapsulasi: "Samarkand Railway",
  };

  return branchLabelMap[normalizedBranch] || branch || "";
};

const formatTelegramDateTime = (value) => {
  const date = value ? new Date(value) : new Date();

  if (Number.isNaN(date.getTime())) {
    return value || new Date().toLocaleString("en-US");
  }

  return new Intl.DateTimeFormat("en-US", {
    timeZone: process.env.BOOKING_TIME_ZONE || "Asia/Tashkent",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};

const formatTelegramPrice = (price) =>
  `${Number(price || 0).toLocaleString("en-US")} UZS`;

const getTelegramCapsuleLabel = (capsuleType) =>
  String(capsuleType || "")
    .trim()
    .toUpperCase();

const buildTelegramBookingText = ({ rawItem, item, payment, orderId }) => {
  const name =
    rawItem.name ||
    [rawItem.firstName, rawItem.lastName].filter(Boolean).join(" ") ||
    payment.name ||
    "";
  const email = rawItem.email || payment.email || "";
  const phone = rawItem.phone || payment.phone || "";
  const bookedAt =
    rawItem.bookedAt ||
    rawItem.createdAt ||
    payment.createdAt ||
    payment.updatedAt ||
    new Date().toISOString();

  return `📢 Yangi bron qabul qilindi

👤 Ism: ${name}
📧 Email: ${email}
📞 Telefon: ${phone}

📍 Filial: ${getTelegramBranchLabel(item.branch || rawItem.locationLabel)}
🗓 Bron vaqti: ${formatTelegramDateTime(bookedAt)}

📅 Kirish sanasi: ${item.date}
⏰ Kirish vaqti: ${item.time}
🛏️ Capsula: ${getTelegramCapsuleLabel(item.capsuleType)}

📆 Davomiylik: ${item.duration} soat
💶 Narx: ${formatTelegramPrice(rawItem.price)}

❕ @freemustafa Send an Invoice to the guest!
✅ Mijoz kelganda, mavjud bo‘lgan ixtiyoriy bo‘sh kapsulaga joylashtiriladi
🌐 Sayt: qonoqcapsule.uz

💳 Order ID: ${orderId}`;
};

const app = express();
const PORT = process.env.PORT || 5000;

/* ================= MIDDLEWARE ================= */

const allowedOrigins = [
  "https://qonoqcapsule.uz",
  "https://www.qonoqcapsule.uz",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_WWW,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  }),
);

app.use(express.json());

/* ================= PATH ================= */

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

  await pool.query(`
  ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS price NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'confirmed'
`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS pending_payments (
      id TEXT PRIMARY KEY,
      "octoPaymentId" TEXT,
      amount NUMERIC,
      phone TEXT,
      email TEXT,
      name TEXT,
      bookings JSONB,
      status TEXT DEFAULT 'created',
      "createdAt" TEXT,
      "updatedAt" TEXT,
      "rawCallback" JSONB
    )
  `);

  // 🔥 SHUNI QO‘SHASAN
  await pool.query(`
    ALTER TABLE pending_payments
    ADD COLUMN IF NOT EXISTS "telegramsent" BOOLEAN DEFAULT false
  `);

  console.log("✅ PostgreSQL connected");
}

initDB().catch((err) => {
  console.error("DB INIT ERROR:", err);
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

function normalizeBookingItem(item = {}) {
  return {
    branch: item.branch || item.locationLabel || "",
    capsuleType: item.capsuleType || item.room || "",
    date: item.date || item.checkInDate || "",
    time: item.time || item.checkInTime || "",
    duration: Number(item.duration) || 0,
  };
}

function isSuccessStatus(status) {
  if (!status) return false;

  const value = String(status).toLowerCase();

  return [
    "succeeded",
    "success",
    "paid",
    "capture",
    "captured",
    "completed",
  ].includes(value);
}

function isFailedStatus(status) {
  if (!status) return false;

  const value = String(status).toLowerCase();

  return [
    "failed",
    "cancel",
    "cancelled",
    "canceled",
    "expired",
    "rejected",
  ].includes(value);
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

async function checkManyBookingsAvailability(bookings = []) {
  for (const rawItem of bookings) {
    const item = normalizeBookingItem(rawItem);

    if (
      !item.branch ||
      !item.capsuleType ||
      !item.date ||
      !item.time ||
      !item.duration
    ) {
      return {
        available: false,
        error: "Booking data is incomplete",
        item,
      };
    }

    const result = await checkAvailability(item);

    if (!result.available) {
      return {
        available: false,
        ...result,
        item,
      };
    }
  }

  return { available: true };
}

async function savePendingPayment({
  orderId,
  octoPaymentId = null,
  amount,
  phone = "",
  email = "",
  name = "",
  bookings = [],
  status = "created",
}) {
  const now = new Date().toISOString();

  await pool.query(
    `
      INSERT INTO pending_payments
      (id, "octoPaymentId", amount, phone, email, name, bookings, status, "createdAt", "updatedAt")
      VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8,$9,$10)
      ON CONFLICT (id)
      DO UPDATE SET
        "octoPaymentId" = EXCLUDED."octoPaymentId",
        amount = EXCLUDED.amount,
        phone = EXCLUDED.phone,
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        bookings = EXCLUDED.bookings,
        status = EXCLUDED.status,
        "updatedAt" = EXCLUDED."updatedAt"
    `,
    [
      orderId,
      octoPaymentId,
      Number(amount),
      phone,
      email,
      name,
      JSON.stringify(bookings || []),
      status,
      now,
      now,
    ],
  );
}

async function updatePendingPaymentMeta({
  orderId,
  octoPaymentId = null,
  status = null,
  rawCallback = null,
}) {
  const now = new Date().toISOString();

  await pool.query(
    `
      UPDATE pending_payments
      SET
        "octoPaymentId" = COALESCE($2, "octoPaymentId"),
        status = COALESCE($3, status),
        "rawCallback" = COALESCE($4::jsonb, "rawCallback"),
        "updatedAt" = $5
      WHERE id = $1
    `,
    [
      orderId,
      octoPaymentId,
      status,
      rawCallback ? JSON.stringify(rawCallback) : null,
      now,
    ],
  );
}

async function finalizePayment(orderId, callbackPayload) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const paymentRes = await client.query(
      `SELECT * FROM pending_payments WHERE id=$1 FOR UPDATE`,
      [orderId],
    );

    if (paymentRes.rowCount === 0) {
      await client.query("ROLLBACK");
      return { ok: false, message: "Pending payment not found" };
    }

    const payment = paymentRes.rows[0];

    const currentStatus = payment.status || "";
    const callbackStatus =
      callbackPayload?.status ||
      callbackPayload?.payment_status ||
      callbackPayload?.transaction_status ||
      callbackPayload?.data?.status ||
      callbackPayload?.data?.payment_status ||
      callbackPayload?.data?.transaction_status ||
      "";

    const octoPaymentId =
      callbackPayload?.octo_payment_UUID ||
      callbackPayload?.octoPaymentId ||
      callbackPayload?.data?.octo_payment_UUID ||
      callbackPayload?.data?.octoPaymentId ||
      null;

    // ❗ Duplicate Telegram oldini olish
    if (payment.telegramsent === true) {
      await client.query("COMMIT");
      return { ok: true, message: "Already processed (telegram sent)" };
    }

    if (isSuccessStatus(currentStatus)) {
      await client.query(
        `
          UPDATE pending_payments
          SET
            "octoPaymentId" = COALESCE($2, "octoPaymentId"),
            "rawCallback" = $3::jsonb,
            "updatedAt" = $4
          WHERE id = $1
        `,
        [
          orderId,
          octoPaymentId,
          JSON.stringify(callbackPayload),
          new Date().toISOString(),
        ],
      );

      await client.query("COMMIT");
      return { ok: true, message: "Already finalized" };
    }

    if (!isSuccessStatus(callbackStatus)) {
      const nextStatus = isFailedStatus(callbackStatus)
        ? callbackStatus
        : callbackStatus || "pending";

      await client.query(
        `
          UPDATE pending_payments
          SET
            status = $2,
            "octoPaymentId" = COALESCE($3, "octoPaymentId"),
            "rawCallback" = $4::jsonb,
            "updatedAt" = $5
          WHERE id = $1
        `,
        [
          orderId,
          nextStatus,
          octoPaymentId,
          JSON.stringify(callbackPayload),
          new Date().toISOString(),
        ],
      );

      await client.query("COMMIT");
      return {
        ok: true,
        message: `Callback saved with non-final status: ${nextStatus}`,
      };
    }

    const bookings = Array.isArray(payment.bookings) ? payment.bookings : [];

    for (const rawItem of bookings) {
      const item = normalizeBookingItem(rawItem);

      const avail = await checkAvailability(item);

      if (!avail.available) {
        await client.query(
          `
            UPDATE pending_payments
            SET
              status = $2,
              "octoPaymentId" = COALESCE($3, "octoPaymentId"),
              "rawCallback" = $4::jsonb,
              "updatedAt" = $5
            WHERE id = $1
          `,
          [
            orderId,
            "paid_but_slot_unavailable",
            octoPaymentId,
            JSON.stringify(callbackPayload),
            new Date().toISOString(),
          ],
        );

        await client.query("COMMIT");

        return {
          ok: false,
          message: "Payment succeeded but selected slot is no longer available",
        };
      }
    }

    for (const rawItem of bookings) {
      const item = normalizeBookingItem(rawItem);

      const bookingId = rawItem.id || crypto.randomUUID();
      const createdAt = new Date().toISOString();

      await client.query(
        `
    INSERT INTO bookings 
    (id, branch, "capsuleType", date, time, duration, "createdAt", name, phone, email, price, payment_status)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    ON CONFLICT (id) DO NOTHING
  `,
        [
          bookingId,
          item.branch,
          item.capsuleType,
          item.date,
          item.time,
          item.duration,
          createdAt,
          rawItem.name || payment.name || "",
          rawItem.phone || payment.phone || "",
          rawItem.email || payment.email || "",
          Number(rawItem.price || payment.amount || 0),
          "paid",
        ],
      );
    }

    // 🔥 TELEGRAM SEND (ENG MUHIM)
    try {
      for (const rawItem of bookings) {
        const item = normalizeBookingItem(rawItem);
        const text = buildTelegramBookingText({
          rawItem,
          item,
          payment,
          orderId,
        });

        await axios.post(
          `https://api.telegram.org/bot${process.env.BOOKING_BOT_TOKEN}/sendMessage`,
          {
            chat_id: getTelegramChatIdForBranch(item.branch),
            text,
          },
        );
      }
    } catch (err) {
      console.log("TELEGRAM AUTO ERROR:", err.message);
    }

    await client.query(
      `
        UPDATE pending_payments
        SET
          status = $2,
          "octoPaymentId" = COALESCE($3, "octoPaymentId"),
          "rawCallback" = $4::jsonb,
          "updatedAt" = $5
        WHERE id = $1
      `,
      [
        orderId,
        callbackStatus || "succeeded",
        octoPaymentId,
        JSON.stringify(callbackPayload),
        new Date().toISOString(),
      ],
    );

    // 🔐 telegram sent flag
    await client.query(
      `UPDATE pending_payments SET "telegramsent"=true WHERE id=$1`,
      [orderId],
    );

    await client.query("COMMIT");

    return { ok: true, message: "Payment finalized and telegram sent" };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

/* ================= AVAILABILITY ================= */

app.post("/api/check-availability", async (req, res) => {
  try {
    const { branch, capsuleType, date, time, duration } = req.body;

    const result = await checkAvailability({
      branch,
      capsuleType,
      date,
      time,
      duration,
    });

    res.json(result);
  } catch (err) {
    console.error("AVAILABILITY ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= BOOKINGS ================= */

app.get("/api/bookings", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM bookings ORDER BY date, time`,
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET BOOKINGS ERROR:", err);
    res.status(500).json({ error: "DB error" });
  }
});

app.post("/api/bookings", async (req, res) => {
  const { branch, capsuleType, date, time, duration } = req.body;

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

    await pool.query(
      `INSERT INTO bookings (id, branch, "capsuleType", date, time, duration, "createdAt") VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [id, branch, capsuleType, date, time, duration, createdAt],
    );

    res.json({ success: true, id });
  } catch (err) {
    console.error("BOOKING ERROR:", err);
    res.status(500).json({ error: "Insert failed" });
  }
});

app.delete("/api/bookings/:id", async (req, res) => {
  try {
    await pool.query(`DELETE FROM bookings WHERE id=$1`, [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE BOOKING ERROR:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

/* ================= CAPSULE ADMIN PANEL ================= */

app.get("/api/capsule-admin/bookings", async (req, res) => {
  try {
    const { branch } = req.query;

    let query = `
      SELECT 
        id,
        branch,
        "capsuleType",
        date,
        time,
        duration,
        "createdAt",
        name,
        phone,
        email,
        price,
        payment_status
      FROM bookings
    `;

    const params = [];

    if (branch && branch !== "all") {
      query += ` WHERE branch=$1`;
      params.push(branch);
    }

    query += ` ORDER BY date DESC, time DESC`;

    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (err) {
    console.error("CAPSULE ADMIN GET BOOKINGS ERROR:", err);
    res.status(500).json({ error: "DB error" });
  }
});

app.get("/api/capsule-admin/bookings/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `
        SELECT 
          id,
          branch,
          "capsuleType",
          date,
          time,
          duration,
          "createdAt",
          name,
          phone,
          email,
          price,
          payment_status
        FROM bookings
        WHERE id=$1
      `,
      [req.params.id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("CAPSULE ADMIN GET BOOKING ERROR:", err);
    res.status(500).json({ error: "DB error" });
  }
});

app.post("/api/capsule-admin/bookings", async (req, res) => {
  try {
    const {
      branch,
      capsuleType,
      date,
      time,
      duration,
      name = "",
      phone = "",
      email = "",
      price = 0,
      payment_status = "manual",
    } = req.body;

    if (!branch || !capsuleType || !date || !time || !duration) {
      return res.status(400).json({
        error: "branch, capsuleType, date, time, duration are required",
      });
    }

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

    await pool.query(
      `
        INSERT INTO bookings
        (id, branch, "capsuleType", date, time, duration, "createdAt", name, phone, email, price, payment_status)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      `,
      [
        id,
        branch,
        capsuleType,
        date,
        time,
        Number(duration),
        createdAt,
        name,
        phone,
        email,
        Number(price || 0),
        payment_status,
      ],
    );

    res.json({ success: true, id });
  } catch (err) {
    console.error("CAPSULE ADMIN CREATE BOOKING ERROR:", err);
    res.status(500).json({ error: "Create failed" });
  }
});

app.delete("/api/capsule-admin/bookings/:id", async (req, res) => {
  try {
    await pool.query(`DELETE FROM bookings WHERE id=$1`, [req.params.id]);

    res.json({ success: true });
  } catch (err) {
    console.error("CAPSULE ADMIN DELETE BOOKING ERROR:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

/* ================= OCTO PAYMENT ================= */

app.post("/api/create-payment", async (req, res) => {
  try {
    const {
      amount,
      bookings = [],
      phone = "",
      email = "",
      name = "",
    } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    if (!Array.isArray(bookings) || bookings.length === 0) {
      return res.status(400).json({ error: "Bookings are required" });
    }

    const availabilityCheck = await checkManyBookingsAvailability(bookings);

    if (!availabilityCheck.available) {
      return res.status(409).json(availabilityCheck);
    }

    const orderId = crypto.randomUUID();

    await savePendingPayment({
      orderId,
      amount,
      phone,
      email,
      name,
      bookings,
      status: "created",
    });

    const payload = {
      octo_shop_id: Number(process.env.OCTO_SHOP_ID),
      octo_secret: process.env.OCTO_SECRET,
      shop_transaction_id: orderId,
      auto_capture: true,
      test: String(process.env.OCTO_TEST_MODE || "false") === "true",
      init_time: new Date().toISOString().slice(0, 19).replace("T", " "),

      user_data: {
        user_id: name || orderId,
        phone:
          phone && phone.replace(/\D/g, "").startsWith("998")
            ? phone.replace(/\D/g, "")
            : "998901234567",
        email: email || "",
      },

      total_sum: Number(amount),
      currency: "UZS",

      basket: bookings.map((b) => ({
        position_desc: "Capsule booking",
        count: 1,
        price: Number(b.price),
        spic: process.env.OCTO_SPIC || "00000000",
        inn: process.env.OCTO_INN,
        package_code: process.env.OCTO_PACKAGE_CODE || "1212121",
        nds: Number(process.env.OCTO_NDS || 0),
      })),

      description: "Qonoq Capsule Booking",
      return_url: `${
        process.env.FRONTEND_URL || "https://qonoqcapsule.uz"
      }/success?orderId=${orderId}`,
      notify_url:
        process.env.OCTO_NOTIFY_URL ||
        "https://qonoqcapsule-backend.onrender.com/api/octo-callback",
      language: "uz",
      ttl: 15,
    };

    const response = await axios.post(
      "https://secure.octo.uz/prepare_payment",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = response.data;

    if (!data || Number(data.error) !== 0) {
      await updatePendingPaymentMeta({
        orderId,
        status: "prepare_failed",
        rawCallback: data || { error: "Unknown OCTO error" },
      });

      return res.status(500).json({
        error: "OCTO prepare_payment failed",
        details: data,
      });
    }

    const octoPaymentId = data?.data?.octo_payment_UUID || null;

    await updatePendingPaymentMeta({
      orderId,
      octoPaymentId,
      status: data?.data?.status || "waiting_payment",
      rawCallback: data,
    });

    res.json({
      paymentUrl: data.data.octo_pay_url,
      paymentId: octoPaymentId,
      orderId,
    });
  } catch (err) {
    console.error("OCTO ERROR:", err.response?.data || err.message);

    res.status(500).json({
      error: "Payment failed",
      details: err.response?.data || err.message,
    });
  }
});

/* ================= OCTO CALLBACK ================= */

app.post("/api/octo-callback", async (req, res) => {
  try {
    console.log("OCTO CALLBACK:", JSON.stringify(req.body, null, 2));

    const orderId =
      req.body?.shop_transaction_id ||
      req.body?.merchant_transaction_id ||
      req.body?.data?.shop_transaction_id ||
      req.body?.data?.merchant_transaction_id;

    if (!orderId) {
      return res.status(400).json({
        status: "error",
        message: "shop_transaction_id not found in callback",
      });
    }

    const result = await finalizePayment(orderId, req.body);

    if (!result.ok) {
      return res.status(200).json({
        status: "warning",
        message: result.message,
      });
    }

    return res.status(200).json({
      status: "ok",
      message: result.message,
    });
  } catch (err) {
    console.error("OCTO CALLBACK ERROR:", err);
    return res.status(500).json({
      status: "error",
      message: "Callback processing failed",
    });
  }
});

/* ================= PAYMENT STATUS ================= */

app.get("/api/payment-status/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const result = await pool.query(
      `SELECT id, "octoPaymentId", amount, phone, email, name, bookings, status, "createdAt", "updatedAt" FROM pending_payments WHERE id=$1`,
      [orderId],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("PAYMENT STATUS ERROR:", err);
    res.status(500).json({ error: "DB error" });
  }
});

/* ================= TELEGRAM CONTACT ================= */

app.post("/notify/telegram", async (req, res) => {
  try {
    const branch = getTelegramContactBranch(req.body);
    const chatId = getTelegramContactChatIdForBranch(branch);
    const text = buildTelegramContactText(req.body);

    if (!chatId) {
      return res.status(400).json({
        success: false,
        error: "Valid branch is required",
      });
    }

    if (!text.trim()) {
      return res.status(400).json({
        success: false,
        error: "Message text is required",
      });
    }

    const url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;

    const telegramResponse = await axios.post(url, {
      chat_id: chatId,
      text,
    });

    res.json({
      success: true,
      message_id: telegramResponse.data?.result?.message_id,
    });
  } catch (error) {
    console.log("TELEGRAM ERROR:", error.response?.data || error.message);
    res.status(500).json({ success: false });
  }
});

/* ================= TELEGRAM BOOKING ================= */

app.post("/notify/booking", async (req, res) => {
  try {
    const { booking } = req.body;

    const chatId = getTelegramChatIdForBranch(
      booking.branch || booking.locationLabel,
    );

    const text = `📢 Yangi bron qabul qilindi

👤 Ism: ${booking.name}
📧 Email: ${booking.email}
📞 Telefon: ${booking.phone}

📍 Filial: ${getTelegramBranchLabel(booking.branch || booking.locationLabel)}
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
    console.log("TELEGRAM BOOKING ERROR:", err.response?.data || err.message);
    res.status(500).json({ success: false });
  }
});

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
    console.log("EMAIL ERROR:", err.response?.data || err.message);
    res.status(500).json({ success: false });
  }
});

/* ================= START ================= */

app.listen(PORT, () => {
  console.log("🚀 Server top running", PORT);
});
