import React from "react";
import "./qonoq.scss";
import { BsFillStarFill } from "react-icons/bs";
import { FaFireExtinguisher, FaRegBell, FaRegClock } from "react-icons/fa";
import {
  MdAdminPanelSettings,
  MdLight,
  MdOutlineBedtime,
  MdPowerSettingsNew,
  MdSafetyCheck,
  MdWifi,
} from "react-icons/md";
import { GiPillow } from "react-icons/gi";
import { TbWindmillFilled } from "react-icons/tb";
import { WiThermometer } from "react-icons/wi";
import { useTranslation, Trans } from "react-i18next";
import { IoIosTv } from "react-icons/io";

const Qonoq = () => {
  const { t } = useTranslation();

  return (
    <div className="qonoq">
      <div className="container">
        <h2 className="qonoq__title">{t("trusted_by_travelers_worldwide")}</h2>
        <p className="qonoq__text">{t("intro_paragraph")}</p>

        <div className="qonoq__small-box">
          <div className="qonoq__small-card">
            <div className="qonoq__small-icon">
              <BsFillStarFill />
            </div>
            <h2 className="qonoq__small-title">{t("customer_rating_title")}</h2>
            <p className="qonoq__small-text">{t("customer_rating_text")}</p>
          </div>

          <div className="qonoq__small-card">
            <div className="qonoq__small-icon">
              <FaRegClock />
            </div>
            <h2 className="qonoq__small-title">{t("open_247_title")}</h2>
            <p className="qonoq__small-text">{t("open_247_text")}</p>
          </div>

          <div className="qonoq__small-card">
            <div className="qonoq__small-icon">
              <MdOutlineBedtime />
            </div>
            <h2 className="qonoq__small-title">
              {t("on_site_availability_title")}
            </h2>
            <p className="qonoq__small-text">
              {t("on_site_availability_text")}
            </p>
          </div>

          <div className="qonoq__small-card">
            <div className="qonoq__small-icon">
              <FaRegBell />
            </div>
            <h2 className="qonoq__small-title">{t("wake_up_service_title")}</h2>
            <p className="qonoq__small-text">{t("wake_up_service_text")}</p>
          </div>
        </div>

        <div className="qonoq__big-box">
          <div className="qonoq__big-card">
            <h1 className="qonoq__card-title">{t("amenities_inside_title")}</h1>
            <div className="qonoq__big-div">
              <div className="qonoq__cardd qonoq__first-cardd">
                <div className="qonoq__card-div">
                  <div className="qonoq__big-icon">
                    <TbWindmillFilled className="big-icon" />
                  </div>
                  <h2 className="qonoq__big-title">{t("ventilation_title")}</h2>
                  <p className="qonoq__big-text">{t("ventilation_text")}</p>
                </div>

                <div className="qonoq__card-div">
                  <div className="qonoq__big-icon">
                    <MdPowerSettingsNew className="big-icon" />
                  </div>
                  <h2 className="qonoq__big-title">
                    {t("charging_point_title")}
                  </h2>
                  <p className="qonoq__big-text">{t("charging_point_text")}</p>
                </div>

                <div className="qonoq__card-div">
                  <div className="qonoq__big-icon">
                    <MdSafetyCheck  className="big-icon" />
                  </div>
                  <h2 className="qonoq__big-title">{t("temperature_title")}</h2>
                  <p className="qonoq__big-text">{t("temperature_text")}</p>
                </div>

                <div className="qonoq__card-div">
                  <div className="qonoq__big-icon">
                    <GiPillow className="big-icon" />
                  </div>
                  <h2 className="qonoq__big-title">{t("bedding_title")}</h2>
                  <p className="qonoq__big-text">{t("bedding_text")}</p>
                </div>

                <div className="qonoq__card-div">
                  <div className="qonoq__big-icon">
                    <MdWifi className="big-icon" />
                  </div>
                  <h2 className="qonoq__big-title">{t("wifi_title")}</h2>
                  <p className="qonoq__big-text">{t("wifi_text")}</p>
                </div>

                <div className="qonoq__card-div">
                  <div className="qonoq__big-icon">
                    <MdAdminPanelSettings  className="big-icon" />
                  </div>
                  <h2 className="qonoq__big-title">{t("admin_title")}</h2>
                  <p className="qonoq__big-text">{t("admin_text")}</p>
                </div>

                <div className="qonoq__card-div">
                  <div className="qonoq__big-icon">
                    <FaFireExtinguisher className="big-icon" />
                  </div>
                  <h2 className="qonoq__big-title">{t("fire_title")}</h2>
                  <p className="qonoq__big-text">{t("fire_text")}</p>
                </div>

                <div className="qonoq__card-div">
                  <div className="qonoq__big-icon">
                    <MdLight className="big-icon" />
                  </div>
                  <h2 className="qonoq__big-title">
                    {t("led_lighting_title")}
                  </h2>
                  <p className="qonoq__big-text">{t("led_lighting_text")}</p>
                </div>

                <div className="qonoq__card-div">
                  <div className="qonoq__big-icon">
                    <IoIosTv className="big-icon" />
                  </div>
                  <h2 className="qonoq__big-title">
                    Smart TV
                  </h2>
                  <p className="qonoq__big-text">{t("tv_lighting_text")}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="qonoq__big-card big-card">
            <img className="qonoq__big-img" src="/9.png" alt={t("image_alt")} />
            <h2 className="qonoq__big-exp">{t("experience_title")}</h2>
            <p className="qonoq__big-about">{t("experience_paragraph")}</p>
            <div className="qonoq__big-links">
              <a href="tel:+998952322424" className="qonoq__big-link">
                {t("contact_now")}
              </a>
              <a href="/" className="qonoq__big-link">
                {t("booking_now")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Qonoq;
