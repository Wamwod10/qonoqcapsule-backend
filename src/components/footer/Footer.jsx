import React from "react";
import "./footer.scss";
import { RiTelegram2Fill } from "react-icons/ri";
import { AiFillInstagram } from "react-icons/ai";
import { FaGoogle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { IoIosCall } from "react-icons/io";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <div className="footer">
      <div className="container">
        <div className="footer__box">
          <div className="footer__div">
            {/* Logo & description */}
            <div className="footer__card">
              <a href="/" className="nav__logo">
                <img src="/6.png" alt="Qonoq Capsule" />
              </a>
              <p className="footer__text">{t("footer_description")}</p>
              <div className="footer__socials">
                <a href="#" className="footer__social">
                  <RiTelegram2Fill />
                </a>
                <a href="#" className="footer__social">
                  <AiFillInstagram />
                </a>
                <a href="#" className="footer__social">
                  <FaGoogle />
                </a>
              </div>
            </div>

            {/* Quick links */}
            <div className="footer__card">
              <h2 className="footer__card-title">{t("footer_quick_links")}</h2>
              <ul className="footer__list">
                <li className="footer__item">
                  <a href="#" className="footer__link">
                    {t("footer_link_home")}
                  </a>
                </li>
                <li className="footer__item">
                  <a href="#" className="footer__link">
                    {t("footer_link_capsules")}
                  </a>
                </li>
                <li className="footer__item">
                  <a href="#" className="footer__link">
                    {t("footer_link_services")}
                  </a>
                </li>
                <li className="footer__item">
                  <a href="#" className="footer__link">
                    {t("footer_link_rules")}
                  </a>
                </li>
                <li className="footer__item">
                  <a href="#" className="footer__link">
                    {t("footer_link_contact")}
                  </a>
                </li>
                <li className="footer__item">
                  <a href="#" className="footer__link">
                    {t("footer_link_my_booking")}
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact info */}
            <div className="footer__card">
              <h2 className="footer__card-title">
                {t("footer_contact_title")}
              </h2>
              <p className="footer__card-contact">
                {t("footer_contact_address")}
              </p>
              <p className="footer__card-contact">
                {t("footer_contact_phone_label")}{" "}
              </p>
              <div className="footer__phones">
                <a href="tel:+998958772424">Tashkent Airport: +998 95 232 24 24 <IoIosCall /></a>
                <a href="tel:+998958772424">Samarkand Airport: +998 95 662 24 14 <IoIosCall /></a>
                <a href="tel:+998958772424">Samarkand Railway: +998 95 236 24 14 <IoIosCall /></a>
              </div>
              <p className="footer__card-contact">
                {t("footer_contact_email_label")}{" "}
                <a href="mailto:qonoqcapsule@mail.ru">qonoqcapsule@mail.ru</a>
              </p>
            </div>
          </div>

          <div className="footer__line"></div>

          <p className="footer__line-text">{t("footer_rights")}</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
