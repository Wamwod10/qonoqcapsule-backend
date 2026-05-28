import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import "./capsmodal.scss";
import { useTranslation } from "react-i18next";
import Confirm from "../capstype/Confirm";
import {
  getCapsulePrice,
  STORAGE_KEY,
} from "../../../../data/bookingConfig";

const CapsModal = ({ onClose }) => {
  const { t } = useTranslation();

  const [closing, setClosing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState({});

  const bookingBase = useMemo(() => {
    try {
      const parsed = JSON.parse(
        sessionStorage.getItem(STORAGE_KEY) || "{}",
      );
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (err) {
      console.error("SESSION STORAGE READ ERROR:", err);
      return {};
    }
  }, []);

  const capsuleType = bookingBase.capsuleTypeValue || "standard";
  const branchKey = bookingBase.branchKey || bookingBase.locationValue;
  const duration = bookingBase.durationValue || "4h";
  const price = getCapsulePrice(branchKey, capsuleType, duration);

  const closeAll = () => {
    setClosing(true);

    setTimeout(() => {
      setShowConfirm(false);
      onClose?.();
    }, 300);
  };

  useEffect(() => {
    const escHandler = (e) => {
      if (e.key === "Escape") {
        closeAll();
      }
    };

    document.addEventListener("keydown", escHandler);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", escHandler);
      document.body.style.overflow = "auto";
    };
  }, []);

  const sanitizePhone = (value) => {
    return String(value || "").replace(/[^\d+]/g, "");
  };

  const validateForm = () => {
    const nextErrors = {};

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const phone = form.phone.trim();
    const email = form.email.trim();

    if (!firstName) {
      nextErrors.firstName = t("capsmodal_first_name");
    }

    if (!lastName) {
      nextErrors.lastName = t("capsmodal_last_name");
    }

    if (!phone) {
      nextErrors.phone = t("capsmodal_phone");
    }

    if (!email) {
      nextErrors.email = t("capsmodal_email");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      nextErrors.email = "Invalid email";
    }

    const cleanDigits = phone.replace(/\D/g, "");
    if (phone && cleanDigits.length < 9) {
      nextErrors.phone = "Invalid phone number";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleInputChange = (key, value) => {
    const nextValue = key === "phone" ? sanitizePhone(value) : value;

    setForm((prev) => ({
      ...prev,
      [key]: nextValue,
    }));

    if (errors[key]) {
      setErrors((prev) => ({
        ...prev,
        [key]: "",
      }));
    }
  };

  const handleConfirm = () => {
    if (!validateForm()) return;

    const newBooking = {
      id:
        globalThis.crypto?.randomUUID?.() ||
        `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      ...bookingBase,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim().toLowerCase(),
      price,
      createdAt: new Date().toISOString(),
    };

    try {
      const oldBookings = JSON.parse(localStorage.getItem("my_bookings")) || [];
      const safeOldBookings = Array.isArray(oldBookings) ? oldBookings : [];

      localStorage.setItem(
        "my_bookings",
        JSON.stringify([...safeOldBookings, newBooking]),
      );

      setShowConfirm(true);
    } catch (err) {
      console.error("LOCALSTORAGE WRITE ERROR:", err);
      alert("Could not save booking. Please try again.");
    }
  };

  return createPortal(
    <>
      {!showConfirm && (
        <div
          className={`capsmodal ${closing ? "closing" : ""}`}
          onClick={closeAll}
        >
          <div
            className={`capsmodal__box ${closing ? "closing" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="capsmodal__title">{t("capsmodal_title")}</h2>

            <div className="capsmodal__form">
              <div className="input-group">
                <input
                  required
                  type="text"
                  value={form.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                />
                <label>{t("capsmodal_first_name")}</label>
                {errors.firstName && (
                  <small className="input-error">{errors.firstName}</small>
                )}
              </div>

              <div className="input-group">
                <input
                  required
                  type="text"
                  value={form.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                />
                <label>{t("capsmodal_last_name")}</label>
                {errors.lastName && (
                  <small className="input-error">{errors.lastName}</small>
                )}
              </div>

              <div className="input-group">
                <input
                  required
                  type="text"
                  value={form.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
                <label>{t("capsmodal_phone")}</label>
                {errors.phone && (
                  <small className="input-error">{errors.phone}</small>
                )}
              </div>

              <div className="input-group">
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
                <label>{t("capsmodal_email")}</label>
                {errors.email && (
                  <small className="input-error">{errors.email}</small>
                )}
              </div>
            </div>

            <div className="capsmodal__price">
              {t("capsmodal_price")} <span>{price.toLocaleString()} UZS</span>
            </div>

            <div className="capsmodal__actions">
              <button className="btn btn-confirm" onClick={handleConfirm}>
                {t("capsmodal_confirm")}
              </button>

              <button className="btn cancel" onClick={closeAll}>
                {t("capsmodal_cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirm && <Confirm onClose={closeAll} />}
    </>,
    document.body,
  );
};

export default CapsModal;
