import nodemailer from "nodemailer";

let transporter;
let missingCredentialsLogged = false;

const getSmtpConfig = () => ({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const assertSmtpCredentials = () => {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    return;
  }

  if (!missingCredentialsLogged) {
    console.error("Missing SMTP credentials");
    missingCredentialsLogged = true;
  }

  throw new Error("Missing SMTP credentials");
};

const getTransporter = () => {
  if (!transporter) {
    assertSmtpCredentials();
    transporter = nodemailer.createTransport(getSmtpConfig());
  }

  return transporter;
};

const getFromAddress = () =>
  process.env.SMTP_FROM || `"Qonoq Capsule" <${process.env.SMTP_USER}>`;

const formatPrice = (value) => Number(value || 0).toLocaleString("en-US");

export const buildBookingConfirmationText = (booking) => `Thank you for choosing to stay with us via QonoqCapsule.uz!

Please be informed that we are a SLEEP CAPSULE located inside the airport within the transit area.
To stay with us, you must have a valid boarding pass departing from Tashkent Airport.

IMPORTANT NOTE:
We will never ask you for your credit card details or send links via QonoqCapsule.uz for online payments or booking confirmation.

If you have any doubts about your booking status, please check via the QonoqCapsule.uz website or app only,
call us at +998 95 877 24 24 (tel/WhatsApp/Telegram),
or email us at qonoqhotel@mail.ru


YOUR BOOKING DETAILS

Guest: ${booking.guestName || ""}
Email: ${booking.guestEmail || ""}
Phone: ${booking.guestPhone || ""}

Booking Date: ${booking.bookingDate || ""}
Check-in Date: ${booking.checkInDate || ""}
Check-in Time: ${booking.checkInTime || ""}
Room Type: ${booking.roomType || ""}
Duration: ${booking.duration || ""}
Price: ${formatPrice(booking.price)} UZS

Thank you for your reservation.
We look forward to welcoming you!

-- Qonoq Capsule Team`;

export const sendMail = (options) =>
  getTransporter().sendMail({
    from: getFromAddress(),
    ...options,
  });

export const sendBookingConfirmationEmail = async ({
  booking,
  receiptPdf,
  receiptNumber,
}) => {
  if (!booking.guestEmail) {
    throw new Error("Guest email is missing");
  }

  return sendMail({
    to: booking.guestEmail,
    subject: "Qonoq Capsule Booking Confirmation",
    text: buildBookingConfirmationText(booking),
    attachments: [
      {
        filename: `qonoq-capsule-receipt-${receiptNumber}.pdf`,
        content: receiptPdf,
        contentType: "application/pdf",
      },
    ],
  });
};
