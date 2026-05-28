import React, { useEffect, useState } from "react";
import "./capsuleheader.scss";
import { BsCalendar2Date } from "react-icons/bs";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { FaBed } from "react-icons/fa";
import { FaBuildingColumns } from "react-icons/fa6";
import { FiRefreshCcw } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { STORAGE_KEY } from "../../../../data/bookingConfig";

const CapsuleHeader = ({ branchConfig }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  // booking data passed via navigate state or from sessionStorage
  const [booking, setBooking] = useState(() => {
    // try location.state first (but on first render location.state is not reliable),
    // so fallback to sessionStorage
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (err) {
      return {};
    }
  });

  // If navigation passed state, prefer it and also persist it to sessionStorage
  useEffect(() => {
    if (location && location.state && Object.keys(location.state).length > 0) {
      setBooking(location.state);
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(location.state));
      } catch (err) {
        // ignore storage errors
      }
    } else {
      // if no location.state, ensure booking is loaded from sessionStorage (in case route entered directly)
      try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          // only set if parsed has keys and booking is empty
          if (parsed && Object.keys(parsed).length > 0) {
            setBooking(parsed);
          }
        }
      } catch (err) {
        // ignore parse errors
      }
    }
  }, [location]);

  // Helper to show fallback text via i18n default value
  const showOrEmpty = (value) => value || t("empty", { defaultValue: "Empty" });

  const handleModify = (e) => {
    e.preventDefault();

    // 1) Booking ma'lumotlarini o'chirish
    try {
      sessionStorage.removeItem("qonoq_booking");
    } catch (err) {
      console.warn("Session o'chirishda xatolik:", err);
    }

    // 2) Local state-ni darhol bo'shatish (UI zudlik bilan yangilanishi uchun)
    setBooking({});

    // 3) Home page-ga qaytish
    navigate("/", { replace: true });
  };

  return (
    <div className="capsheader">
      <div className="container">
        <div className="capsheader__flex">
          <h1 className="capsheader__title">
            {t("your_reservation", { defaultValue: "Your Reservation:" })}
          </h1>
          <button
            className="capsheader__modify"
            onClick={handleModify}
            aria-label={t("modify_search", { defaultValue: "Modify search" })}
          >
            <FiRefreshCcw />
          </button>
        </div>

        <div className="capsheader__box">
          <div className="capsheader__div">
            <div className="capsheader__link">
              <BsCalendar2Date />{" "}
              <span className="capsheader__link-label">
                {t("check_in") + ":"}
              </span>
            </div>
            <p className="capsheader__date">{showOrEmpty(booking.checkIn)}</p>
          </div>

          <div className="capsheader__div">
            <div className="capsheader__link">
              <BsCalendar2Date />{" "}
              <span className="capsheader__link-label">
                {t("check_in_time") + ":"}
              </span>
            </div>
            <p className="capsheader__date">
              {showOrEmpty(booking.checkInTime)}
            </p>
          </div>

          <div className="capsheader__div">
            <div className="capsheader__link">
              <MdOutlineAccessTimeFilled />{" "}
              <span className="capsheader__link-label">
                {t("duration_label") + ":"}
              </span>
            </div>
            <p className="capsheader__date">
              {showOrEmpty(booking.durationLabel)}
            </p>
          </div>

          <div className="capsheader__div">
            <div className="capsheader__link">
              <FaBed />{" "}
              <span className="capsheader__link-label">
                {t("capsules_label") + ":"}
              </span>
            </div>
            <p className="capsheader__date">
              {showOrEmpty(booking.capsuleTypeLabel)}
            </p>
          </div>

          <div className="capsheader__div">
            <div className="capsheader__link">
              <FaBuildingColumns />{" "}
              <span className="capsheader__link-label">
                {t("branch_label", { defaultValue: "Branch" }) + ":"}
              </span>
            </div>
            <p className="capsheader__date">
              {showOrEmpty(
                branchConfig
                  ? t(branchConfig.labelKey, {
                      defaultValue: branchConfig.fallbackLabel,
                    })
                  : booking.locationLabel,
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapsuleHeader;
