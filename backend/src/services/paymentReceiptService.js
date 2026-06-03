import PDFDocument from "pdfkit";

const getTimeZone = () => process.env.BOOKING_TIME_ZONE || "Asia/Tashkent";

const formatDate = (value) => {
  const date = value ? new Date(value) : new Date();

  if (Number.isNaN(date.getTime())) {
    return value || "";
  }

  return new Intl.DateTimeFormat("en-US", {
    timeZone: getTimeZone(),
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const formatAmount = (value) => Number(value || 0).toLocaleString("en-US");

export const createReceiptNumber = ({ bookingId, orderId, paidAt } = {}) => {
  const date = paidAt ? new Date(paidAt) : new Date();
  const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;
  const datePart = safeDate.toISOString().slice(0, 10).replace(/-/g, "");
  const source = String(bookingId || orderId || Date.now()).replace(/[^a-zA-Z0-9]/g, "");
  const suffix = source.slice(-8).toUpperCase().padStart(8, "0");

  return `QC-${datePart}-${suffix}`;
};

const writePair = (doc, label, value) => {
  doc.font("Helvetica-Bold").text(`${label}: `, { continued: true });
  doc.font("Helvetica").text(String(value || "-"));
};

export const generatePaymentReceiptPdf = (receipt) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    const doc = new PDFDocument({ size: "A4", margin: 48 });

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.font("Helvetica-Bold").fontSize(20).text("QONOQ CAPSULE", {
      align: "center",
    });
    doc.moveDown(0.4);
    doc.fontSize(14).text("Fiscal / Payment Receipt", { align: "center" });
    doc.moveDown(1.5);

    doc.fontSize(10);
    writePair(doc, "Receipt No", receipt.receiptNumber);
    writePair(doc, "Payment ID", receipt.octoPaymentId);
    writePair(doc, "Transaction Date", formatDate(receipt.paymentDate));
    writePair(doc, "Payment Status", "PAID");

    doc.moveDown();
    doc.font("Helvetica-Bold").text("Payer Information:");
    doc.font("Helvetica");
    writePair(doc, "Name", receipt.guestName);
    writePair(doc, "Email", receipt.guestEmail);
    writePair(doc, "Phone", receipt.guestPhone);

    doc.moveDown();
    doc.font("Helvetica-Bold").text("Payment Information:");
    doc.font("Helvetica");
    writePair(doc, "Service", "Sleep Capsule Reservation");
    writePair(doc, "Amount Paid", `${formatAmount(receipt.amount)} UZS`);
    writePair(doc, "Currency", "UZS");
    writePair(doc, "Payment Method", receipt.paymentMethod || "Online Card");

    doc.moveDown();
    doc.font("Helvetica-Bold").text("Payment Provider:");
    doc.font("Helvetica").text(receipt.paymentProvider || "Octo Payment");
    doc.moveDown(0.5);
    doc.font("Helvetica-Bold").text("Acquiring / Payment Partner:");
    doc.font("Helvetica").text("Octo Bank");
    doc.moveDown(0.5);
    doc.font("Helvetica-Bold").text("Merchant:");
    doc.font("Helvetica").text("Qonoq Capsule");

    doc.moveDown();
    doc.text("Payment was processed securely through");
    doc.text("Octo Payment / Octo Bank acquiring system.");
    doc.moveDown();
    doc.text(
      "This receipt is issued by Qonoq Capsule as confirmation of successful payment.",
    );

    doc.moveDown();
    doc.font("Helvetica-Bold").text("Contact:");
    doc.font("Helvetica").text("+998 95 877 24 24");
    doc.text("qonoqhotel@mail.ru");

    doc.end();
  });
