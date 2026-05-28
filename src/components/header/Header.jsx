import React, { useEffect, useMemo, useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  buildBookingState,
  DURATION_HOURS,
  getAvailableCapsuleTypes,
  getBranchConfig,
  getCapsuleTypeConfig,
  getDefaultCapsuleType,
  isCapsuleTypeAvailable,
} from "../../data/bookingConfig";
import "./header.scss";

const API_BASE = "https://qonoqcapsule-backend.onrender.com";
const AVAILABILITY_URL = `${API_BASE}/api/check-availability`;
const REQUEST_TIMEOUT_MS = 12000;

const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [checkIn, setCheckIn] = useState("");
  const [checkInTime, setCheckInTime] = useState("");
  const [locationValue, setLocationValue] = useState("tashkent_airport");
  const [capsuleType, setCapsuleType] = useState("standard");
  const [duration, setDuration] = useState("4h");

  const [busyTime, setBusyTime] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const branchConfig = useMemo(
    () => getBranchConfig(locationValue),
    [locationValue],
  );
  const capsuleOptions = useMemo(
    () => getAvailableCapsuleTypes(branchConfig.key),
    [branchConfig.key],
  );

  useEffect(() => {
    if (!isCapsuleTypeAvailable(branchConfig.key, capsuleType)) {
      setCapsuleType(getDefaultCapsuleType(branchConfig.key));
    }
  }, [branchConfig.key, capsuleType]);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      fetch(API_BASE, {
        method: "GET",
        mode: "no-cors",
        cache: "no-store",
      }).catch(() => {});
    }, 800);

    return () => window.clearTimeout(timerId);
  }, []);

  /* ================= VALIDATION ================= */

  const validate = () => {
    const newErrors = {};

    if (!checkIn)
      newErrors.checkIn = t("required", { defaultValue: "Required" });
    if (!checkInTime)
      newErrors.checkInTime = t("required", { defaultValue: "Required" });
    if (!duration)
      newErrors.duration = t("required", { defaultValue: "Required" });
    if (!capsuleType)
      newErrors.capsuleType = t("required", { defaultValue: "Required" });
    if (!locationValue)
      newErrors.location = t("required", { defaultValue: "Required" });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */

  const fetchAvailability = async (payload) => {
    let lastError = null;

    for (let attempt = 0; attempt < 2; attempt += 1) {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(
        () => controller.abort(),
        REQUEST_TIMEOUT_MS,
      );

      try {
        const response = await fetch(AVAILABILITY_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data?.error || "Availability request failed");
        }

        return data;
      } catch (error) {
        lastError = error;

        if (attempt === 0) {
          await fetch(API_BASE, {
            method: "GET",
            mode: "no-cors",
            cache: "no-store",
          }).catch(() => {});
        }
      } finally {
        window.clearTimeout(timeoutId);
      }
    }

    throw lastError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || loading) return;

    const capsuleConfig = getCapsuleTypeConfig(capsuleType);

    setBusyTime(null);
    setSubmitError("");
    setLoading(true);

    try {
      const data = await fetchAvailability({
        branch: branchConfig.backendBranch,
        capsuleType: capsuleConfig.backendType,
        date: checkIn,
        time: checkInTime,
        duration: DURATION_HOURS[duration],
      });

      if (data.available !== true) {
        setBusyTime({
          time: data?.nextTime || "",
          nextDay: Boolean(data?.nextDay),
        });
        setLoading(false);
        return;
      }
    } catch (error) {
      const message =
        error?.name === "AbortError"
          ? t("availability_timeout", {
              defaultValue:
                "The server is responding slowly. Please try again in a few seconds.",
            })
          : t("availability_error", {
              defaultValue:
                "We could not check availability right now. Please try again.",
            });

      setSubmitError(message);
      setLoading(false);
      return;
    }

    if (!branchConfig) {
      setLoading(false);
      return; // ❗ bu yerda QATTIQ to‘xtaydi
    }

    /* ===== faqat available bo‘lsa pastga tushadi ===== */

    const bookingState = buildBookingState({
      branchInput: branchConfig.key,
      capsuleTypeKey: capsuleType,
      checkIn,
      checkInTime,
      durationValue: duration,
      t,
    });

    try {
      sessionStorage.setItem("qonoq_booking", JSON.stringify(bookingState));
    } catch {}

    setLoading(false);
    navigate(branchConfig.path, { state: bookingState });
  };

  return (
    <div className="header">
      <div className="container">
        <div className="header__box">
          {/* ===== RIGHT ===== */}
          <div className="header__right">
            <h1 className="header__title">
              <Trans
                i18nKey="hero_title"
                components={{ bold: <span /> }}
                values={{ brand: "Qonoq Capsule" }}
              />
            </h1>

            <p className="header__text">{t("hero_subtitle")}</p>

            <div className="header__box-link">
              <a href="/capsule" className="header__link">
                {t("cta_see_capsules")}
              </a>
              <a href="/capsule" className="header__link">
                {t("cta_book_now")}
              </a>
            </div>

            <p className="header__founder">
              {t("founder_label")} <span>{t("founder_name")}</span>
            </p>
          </div>

          {/* ===== LEFT ===== */}
          <div className="header__left">
            <h2 className="header__left-title">{t("book_your_stay")}</h2>

            <form className="header__form" onSubmit={handleSubmit}>
              <div className="header__form-flex">
                <div className="header__form-box check-in">
                  <label htmlFor="checkin" className="header__form-title">
                    {t("check_in")}
                  </label>
                  <input
                    className="header__form-input"
                    type="date"
                    id="checkin"
                    required
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                  {errors.checkIn && (
                    <small className="form-error">{errors.checkIn}</small>
                  )}
                </div>

                <div className="header__form-box check-in">
                  <label htmlFor="checkinTime" className="header__form-title">
                    {t("check_in_time")}
                  </label>
                  <input
                    className="header__form-input"
                    type="time"
                    id="checkinTime"
                    required
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                  />
                  {errors.checkInTime && (
                    <small className="form-error">{errors.checkInTime}</small>
                  )}
                </div>
              </div>

              <div className="header__form-box">
                <label className="header__form-title">
                  {t("select_location")}
                </label>
                <select
                  className="header__form-input header__select"
                  value={locationValue}
                  onChange={(e) => setLocationValue(e.target.value)}
                >
                  <option value="tashkent_airport">
                    {t("branch_tashkent_airport", {
                      defaultValue: "Tashkent Airport",
                    })}
                  </option>
                  <option value="samarkand_airport">
                    {t("branch_samarkand_airport", {
                      defaultValue: "Samarkand Airport",
                    })}
                  </option>
                  <option value="samarkand_railway">
                    {t("branch_samarkand_railway", {
                      defaultValue: "Samarkand Railway",
                    })}
                  </option>
                </select>
              </div>

              <div className="header__form-box">
                <label className="header__form-title">
                  {t("capsules_label")}
                </label>
                <select
                  className="header__form-input header__select"
                  value={capsuleType}
                  onChange={(e) => setCapsuleType(e.target.value)}
                >
                  {capsuleOptions.map((option) => (
                    <option key={option.key} value={option.key}>
                      {t(option.labelKey, {
                        defaultValue: option.fallbackLabel,
                      })}
                    </option>
                  ))}
                </select>
              </div>

              <div className="header__form-box">
                <label className="header__form-title">
                  {t("duration_label")}
                </label>
                <select
                  className="header__form-input header__select"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                >
                  <option value="2h">{t("duration_2h")}</option>
                  <option value="4h">{t("duration_4h")}</option>
                  <option value="6h">{t("duration_6h")}</option>
                  <option value="10h">{t("duration_10h")}</option>
                  <option value="1d">{t("duration_1d")}</option>
                </select>
              </div>

              {/* ===== BUSY MESSAGE ===== */}
              {busyTime && (
                <div className="availability-modal">
                  <div className="availability-modal__box">
                    <p className="availability__modal-text">
                      Capsule is busy! Next available time:
                      {/* <br /> */}
                      <b>
                        {busyTime.time}
                        {busyTime.nextDay &&
                          `  (${t("next_day", { defaultValue: "Next day" })})`}
                      </b>
                    </p>
                    {/* <button
                      type="button"
                      className="availability-modal__btn"
                      onClick={() => setBusyTime(null)}
                    >
                      OK
                    </button> */}
                  </div>
                </div>
              )}

              {submitError && <small className="form-error">{submitError}</small>}

              <div className="header__link-box">
                <button
                  type="submit"
                  className="header__left-link"
                  disabled={loading}
                >
                  {loading
                    ? t("checking", { defaultValue: "Checking..." })
                    : t("check_availability")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
