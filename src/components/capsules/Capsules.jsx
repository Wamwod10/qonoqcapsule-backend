import React from "react";
import "./capsules.scss";
import {
  FaBed,
  FaFan,
  FaLocationArrow,
  FaLock,
  FaPlug,
  FaUserAlt,
} from "react-icons/fa";
import { TbArrowAutofitHeight } from "react-icons/tb";
import {
  MdAir,
  MdHearingDisabled,
  MdLightMode,
  MdOutlineLight,
  MdPowerSettingsNew,
  MdWifi,
} from "react-icons/md";
import { GiMirrorMirror } from "react-icons/gi";
import { useTranslation } from "react-i18next";

const Capsules = () => {
  const { t } = useTranslation();

  return (
    <div className="caps">
      <div className="container">
        <h1 className="caps__title">{t("capsules_page_title")}</h1>
        <div className="caps__box">
          {/* Standard Capsules */}
          <div className="caps__big-card">
            <div className="caps__card">
              <div className="caps__title-card">
                <h2 className="caps__card-title">
                  {t("capsules_standard_title")}
                </h2>
                <div className="caps__info-card">
                  <p className="caps__card-guest">
                    <FaUserAlt className="caps__icon" />{" "}
                    {t("capsules_standard_guests")}
                  </p>
                  <p className="caps__card-guest">
                    <TbArrowAutofitHeight className="caps__icon" />
                    {t("capsules_standard_size")}
                  </p>
                </div>
              </div>
              <a href="#!" className="caps__card-guest">
                <FaLocationArrow className="caps__icon" />{" "}
                {t("capsules_location_tashkent_airport")}
              </a>
              <p className="caps__card-text">
                {t("capsules_standard_description")}
              </p>
              <div className="caps__card-features">
                <h2 className="caps__ft-title">
                  {t("capsules_features_title")}
                </h2>
                <div className="caps__features">
                  <a href="#!" className="caps__ft-link">
                    <FaBed className="caps__ft-icon" />
                    {t("capsules_feature_bed")}
                  </a>
                  <a href="#!" className="caps__ft-link">
                    <MdLightMode className="caps__ft-icon" />
                    {t("capsules_feature_lighting")}
                  </a>
                  <a href="#!" className="caps__ft-link">
                    <FaPlug className="caps__ft-icon" />
                    {t("capsules_feature_outlet")}
                  </a>
                  <a href="#!" className="caps__ft-link">
                    <FaFan className="caps__ft-icon" />
                    {t("capsules_feature_airflow")}
                  </a>
                  <a href="#!" className="caps__ft-link">
                    <MdWifi className="caps__ft-icon" />
                    {t("capsules_feature_wifi")}
                  </a>
                  <a href="#!" className="caps__ft-link">
                    <FaLock className="caps__ft-icon" />
                    {t("capsules_feature_safe")}
                  </a>
                  <a href="#!" className="caps__ft-link">
                    <MdPowerSettingsNew className="caps__ft-icon" />
                    {t("capsules_feature_power")}
                  </a>
                  <a href="#!" className="caps__ft-link">
                    <MdAir className="caps__ft-icon" />
                    {t("capsules_feature_climate")}
                  </a>
                </div>
              </div>
              <div className="qonoq__big-links">
                <a href="#!" className="qonoq__big-link">
                  {t("capsules_btn_gallery")}
                </a>
                <a href="#!" className="qonoq__big-link">
                  {t("capsules_btn_booking")}
                </a>
              </div>
            </div>
            <div className="caps__img-card">
              <div className="caps__price-div">
                <p className="caps__duration">
                  {t("capsules_standard_duration_2h")}
                </p>
                <p className="caps__price">{t("capsules_standard_price_2h")}</p>
              </div>
              <div className="caps__price-div">
                <p className="caps__duration">
                  {t("capsules_standard_duration_4h")}
                </p>
                <p className="caps__price">{t("capsules_standard_price_4h")}</p>
              </div>
              <div className="caps__price-div">
                <p className="caps__duration">
                  {t("capsules_standard_duration_6h")}
                </p>
                <p className="caps__price">{t("capsules_standard_price_6h")}</p>
              </div>
              <div className="caps__price-div">
                <p className="caps__duration">
                  {t("capsules_standard_duration_10h")}
                </p>
                <p className="caps__price">{t("capsules_standard_price_10h")}</p>
              </div>
              <div className="caps__price-div">
                <p className="caps__duration">
                  {t("capsules_standard_duration_1d")}
                </p>
                <p className="caps__price">{t("capsules_standard_price_1d")}</p>
              </div>
            </div>
          </div>

          {/* Family Capsules */}
          <div className="caps__big-card">
            <div className="caps__imgsec-card">
              <div className="caps__price-div">
                <p className="caps__duration">
                  {t("capsules_family_duration_2h")}
                </p>
                <p className="caps__price">{t("capsules_family_price_2h")}</p>
              </div>
              <div className="caps__price-div">
                <p className="caps__duration">
                  {t("capsules_family_duration_4h")}
                </p>
                <p className="caps__price">{t("capsules_family_price_4h")}</p>
              </div>
              <div className="caps__price-div">
                <p className="caps__duration">
                  {t("capsules_family_duration_6h")}
                </p>
                <p className="caps__price">{t("capsules_family_price_6h")}</p>
              </div>
              <div className="caps__price-div">
                <p className="caps__duration">
                  {t("capsules_family_duration_10h")}
                </p>
                <p className="caps__price">{t("capsules_family_price_10h")}</p>
              </div>
              <div className="caps__price-div">
                <p className="caps__duration">
                  {t("capsules_family_duration_1d")}
                </p>
                <p className="caps__price">{t("capsules_family_price_1d")}</p>
              </div>
            </div>
            <div className="caps__card">
              <div className="caps__title-card">
                <h2 className="caps__card-title">
                  {t("capsules_family_title")}
                </h2>
                <div className="caps__info-card">
                  <p className="caps__card-guest">
                    <FaUserAlt className="caps__icon" />{" "}
                    {t("capsules_family_guests")}
                  </p>
                  <p className="caps__card-guest">
                    <TbArrowAutofitHeight className="caps__icon" />
                    {t("capsules_family_size")}
                  </p>
                </div>
              </div>
              <a href="#!" className="caps__card-guest">
                <FaLocationArrow className="caps__icon" />{" "}
                {t("capsules_location_tashkent_airport")}
              </a>
              <p className="caps__card-text">
                {t("capsules_family_description")}
              </p>
              <div className="caps__card-features">
                <h2 className="caps__ft-title">
                  {t("capsules_features_title")}
                </h2>
                <div className="caps__features">
                  <a href="#!" className="caps__ft-link">
                    <GiMirrorMirror className="caps__ft-icon" />
                    {t("capsules_feature_mirror")}
                  </a>
                  <a href="#!" className="caps__ft-link">
                    <MdHearingDisabled className="caps__ft-icon" />
                    {t("capsules_feature_soundproof")}
                  </a>
                  <a href="#!" className="caps__ft-link">
                    <FaPlug className="caps__ft-icon" />
                    {t("capsules_feature_outlet")}
                  </a>
                  <a href="#!" className="caps__ft-link">
                    <FaFan className="caps__ft-icon" />
                    {t("capsules_feature_airflow")}
                  </a>
                  <a href="#!" className="caps__ft-link">
                    <MdWifi className="caps__ft-icon" />
                    {t("capsules_feature_wifi")}
                  </a>
                  <a href="#!" className="caps__ft-link">
                    <FaLock className="caps__ft-icon" />
                    {t("capsules_feature_safe")}
                  </a>
                  <a href="#!" className="caps__ft-link">
                    <MdOutlineLight className="caps__ft-icon" />
                    {t("capsules_feature_reading_lamps")}
                  </a>
                  <a href="#!" className="caps__ft-link">
                    <MdAir className="caps__ft-icon" />
                    {t("capsules_feature_climate")}
                  </a>
                </div>
              </div>
              <div className="qonoq__big-links">
                <a href="#!" className="qonoq__big-link">
                  {t("capsules_btn_gallery")}
                </a>
                <a href="#!" className="qonoq__big-link">
                  {t("capsules_btn_booking")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Capsules;
