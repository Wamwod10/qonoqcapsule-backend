import React from "react";
import "./serviceheader.scss";
import { useTranslation } from "react-i18next";

const Serviceheader = () => {
  const { t } = useTranslation();

  return (
    <div className="serviceheader">
      <div className="container">
        <div className="serviceheader__box">
          <div className="service__card-left">
            <h1 className="serviceheader__title">
              {t("service_header_title")}
            </h1>

            <p className="serviceheader__text1">{t("service_header_text1")}</p>

            <p className="serviceheader__text2">{t("service_header_text2")}</p>

            <div className="serviceheader__big-links">
              <a href="/" className="qonoq__big-link">
                {t("service_header_booking")}
              </a>
              <a href="tel:+998952322424" className="qonoq__big-link">
                {t("service_header_contact")}
              </a>
            </div>
          </div>

          <div className="serviceheader__img">
            <img src="/26.jpg" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Serviceheader;
