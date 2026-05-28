import React, { useEffect, useMemo, useState } from "react";
import BookingCard from "./components/Bookingcard/BookingCard";
import "./mybooking.scss";
import { useTranslation } from "react-i18next";
import { TbMoodEmpty } from "react-icons/tb";
import axios from "axios";
import { getBranchConfig } from "../../data/bookingConfig";

const API = "https://qonoqcapsule-backend.onrender.com";
// const API = "http://localhost:5000";

const MyBooking = () => {
  const { t } = useTranslation();

  const [bookings, setBookings] = useState([]);
  const [currency, setCurrency] = useState("UZS");
  const [checking, setChecking] = useState(false);
  const [paying, setPaying] = useState(false);
  const [busyInfo, setBusyInfo] = useState(null);

  /* ===== HELPERS ===== */

  const durationMap = useMemo(
    () => ({
      "2h": 2,
      "4h": 4,
      "6h": 6,
      "10h": 10,
      "1d": 24,
    }),
    [],
  );

  const readBookingsFromStorage = () => {
    try {
      const raw = localStorage.getItem("my_bookings");
      if (!raw) return [];

      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error("LOCALSTORAGE READ ERROR:", err);
      return [];
    }
  };

  const writeBookingsToStorage = (nextBookings) => {
    try {
      localStorage.setItem("my_bookings", JSON.stringify(nextBookings));
    } catch (err) {
      console.error("LOCALSTORAGE WRITE ERROR:", err);
    }
  };

  const normalizePhone = (phone) => {
    return String(phone || "").trim();
  };

  const normalizeEmail = (email) => {
    return String(email || "")
      .trim()
      .toLowerCase();
  };

  const getFullName = (booking) => {
    return `${booking?.firstName || ""} ${booking?.lastName || ""}`.trim();
  };

  const getBranch = (booking) => {
    return getBranchConfig(booking?.locationValue || booking?.branchKey)
      .backendBranch;
  };

  const getDuration = (booking) => {
    return (
      durationMap[booking?.durationValue] || Number(booking?.duration) || 0
    );
  };

  const normalizeBookingsForBackend = () => {
    return bookings.map((b) => ({
      ...b,
      name: getFullName(b),
      phone: normalizePhone(b.phone),
      email: normalizeEmail(b.email),
      branch: getBranch(b),
      capsuleType: b.backendCapsuleTypeValue || b.capsuleTypeValue || "",
      date: b.checkIn || "",
      time: b.checkInTime || "",
      duration: getDuration(b),
      price: Number(b.price || 0),
    }));
  };

  /* ===== LOAD BOOKINGS ===== */

  useEffect(() => {
    setBookings(readBookingsFromStorage());
  }, []);

  const deleteBooking = (id) => {
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    writeBookingsToStorage(updated);
  };

  /* ===== TOTAL ===== */

  const totalUZS = useMemo(() => {
    return bookings.reduce((sum, b) => sum + Number(b.price || 0), 0);
  }, [bookings]);

  const USD_RATE = 12000;
  const EUR_RATE = 14000;
  const RUB_RATE = 160;

  let displayTotal = totalUZS;

  if (currency === "USD") displayTotal = (totalUZS / USD_RATE).toFixed(1);
  if (currency === "EUR") displayTotal = (totalUZS / EUR_RATE).toFixed(1);
  if (currency === "RUB") displayTotal = (totalUZS / RUB_RATE).toFixed(1);

  /* ===== AVAILABILITY CHECK ===== */

  const checkAllAvailability = async () => {
    setChecking(true);

    try {
      for (const b of bookings) {
        const branch = getBranch(b);

        const res = await fetch(`${API}/api/check-availability`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            branch,
            capsuleType: b.capsuleTypeValue,
            date: b.checkIn,
            time: b.checkInTime,
            duration: getDuration(b),
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Availability request failed");
        }

        if (!data.available) {
          setBusyInfo({
            id: b.id,
            nextTime: data.nextTime,
            nextDay: data.nextDay,
          });

          setChecking(false);
          return false;
        }
      }

      setChecking(false);
      return true;
    } catch (err) {
      console.error("AVAILABILITY CHECK ERROR:", err);
      setChecking(false);
      alert("Availability check failed. Try again.");
      return false;
    }
  };

  /* ===== OCTO PAYMENT ===== */

  const handlePayment = async () => {
    if (bookings.length === 0) return;
    if (paying || checking) return;

    const ok = await checkAllAvailability();
    if (!ok) return;

    try {
      setPaying(true);

      const firstBooking = bookings[0] || {};
      const preparedBookings = normalizeBookingsForBackend();

      const payload = {
        amount: totalUZS,
        bookings: preparedBookings,
        phone: normalizePhone(firstBooking.phone),
        email: normalizeEmail(firstBooking.email),
        name: getFullName(firstBooking),
      };

      const res = await axios.post(`${API}/api/create-payment`, payload);

      const { paymentUrl } = res.data || {};

      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        alert("Payment link not received");
      }
    } catch (err) {
      console.error("PAYMENT ERROR:", err.response?.data || err.message);

      if (err.response?.status === 409) {
        const data = err.response.data;

        setBusyInfo({
          id: data?.item?.id || null,
          nextTime: data?.nextTime || "Unknown",
          nextDay: data?.nextDay || false,
        });
      } else if (err.response?.data?.error) {
        alert(err.response.data.error);
      } else {
        alert("Payment error. Try again.");
      }
    } finally {
      setPaying(false);
    }
  };

  /* ===== UI ===== */

  return (
    <div className="mybooking">
      <div className="container">
        <h1 className="mybooking__title">{t("mybooking_title")}</h1>

        {bookings.length === 0 ? (
          <>
            <div className="mybooking__icon-wrap">
              <TbMoodEmpty className="mybooking__icon" />
            </div>

            <p>{t("mybooking_empty")}</p>

            <a href="/" className="qonoq__big-link mybooking__book-div">
              {t("service_header_booking")}
            </a>
          </>
        ) : (
          <>
            <a
              href="/"
              className="qonoq__big-link mybooking__book-div mybooking__extra"
            >
              Add a Booking +
            </a>

            {bookings.map((b) => (
              <BookingCard key={b.id} booking={b} onDelete={deleteBooking} />
            ))}

            <div className="mybooking__button-div">
              <div className="mybooking__value">
                <h2 className="mybooking__total">
                  Total: {Number(displayTotal).toLocaleString()} {currency}
                </h2>

                <div className="mybooking__currency-switch">
                  <button
                    type="button"
                    onClick={() => setCurrency("UZS")}
                    disabled={checking || paying}
                  >
                    UZS
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrency("USD")}
                    disabled={checking || paying}
                  >
                    USD
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrency("EUR")}
                    disabled={checking || paying}
                  >
                    EUR
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrency("RUB")}
                    disabled={checking || paying}
                  >
                    RUB
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePayment}
                className="mybooking__button"
                disabled={checking || paying}
              >
                {checking
                  ? "Checking availability..."
                  : paying
                    ? "Redirecting to payment..."
                    : "Complete Your Purchase"}
              </button>
            </div>
          </>
        )}
      </div>

      {busyInfo && (
        <div className="availability-modal">
          <div className="availability-modal__box">
            <p>
              This room is busy. Next available time: <b>{busyInfo.nextTime}</b>
              {busyInfo.nextDay ? " (next day)" : ""}
            </p>

            <button type="button" onClick={() => setBusyInfo(null)}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBooking;
