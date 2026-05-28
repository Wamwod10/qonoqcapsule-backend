import React from "react";
import "./alternativecontacts.scss";
import { LuMessageCircle } from "react-icons/lu";
import { LiaTelegramPlane } from "react-icons/lia";
import { HiOutlineMail } from "react-icons/hi";
import { useTranslation } from "react-i18next";

const AlternativeContacts = () => {
  const { t } = useTranslation();

  return (
    <div className="alternative">
      <div className="container">
        <div className="alternative__box">
          <h2 className="alternative__title">{t("alternative_title")}</h2>

          <div className="alternative__box-div">
            <a
              href="https://wa.me/998958772424"
              className="alternative__messages"
            >
              <div>
                <LuMessageCircle className="alternative__icon" />
              </div>
              <div>
                <h2 className="alternative__message-title">
                  {t("alternative_whatsapp")}
                </h2>
                <p className="alternative__message-text">+998 95 232 24 24</p>
              </div>
            </a>

            <a
              href="https://t.me/qonoqcapsulehotel"
              className="alternative__messages"
            >
              <div>
                <LiaTelegramPlane className="alternative__icon icon-telegram" />
              </div>
              <div>
                <h2 className="alternative__message-title">
                  {t("alternative_telegram")}
                </h2>
                <p className="alternative__message-text">@qonoqcapsulehotel</p>
              </div>
            </a>

            <a
              href="mailto:qonoqcapsule@mail.ru"
              className="alternative__messages"
            >
              <div>
                <HiOutlineMail className="alternative__icon icon-email" />
              </div>
              <div>
                <h2 className="alternative__message-title">
                  {t("alternative_email")}
                </h2>
                <p className="alternative__message-text">qonoqcapsule@mail.ru</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlternativeContacts;
