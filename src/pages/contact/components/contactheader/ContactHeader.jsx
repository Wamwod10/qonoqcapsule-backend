import React, { useEffect, useState } from "react";
import { AiOutlinePhone, AiOutlineClose } from "react-icons/ai";
import { IoWarning, IoLocationOutline } from "react-icons/io5";
import "./contactheader.scss";
import { useTranslation } from "react-i18next";

const ContactHeader = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const phoneNumbers = [
    {
      title: "Tashkent Airport",
      number: "+998 95 232 24 24",
      link: "tel:+998952322424",
    },
    {
      title: "Samarkand Airport",
      number: "+998 95 662 24 14",
      link: "tel:+998956622414",
    },
    {
      title: "Samarkand Railway",
      number: "+998 95 236 24 14",
      link: "tel:+998952362414",
    },
  ];

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "unset";
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  return (
    <>
      <section className="contact-header">
        <div className="container">
          <h2 className="contact-header__title">{t("contact_header_title")}</h2>

          <p className="contact-header__subtitle">
            {t("contact_header_subtitle")}
          </p>

          <div className="contact-alert">
            <div className="contact-alert__info">
              <IoWarning className="contact-alert__icon" />
              <div className="contact-alert__text">
                <p className="contact-alert__main-text">
                  {t("contact_alert_text")}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="contact-alert__button"
              onClick={openModal}
            >
              <AiOutlinePhone className="contact-alert__button-icon" />
              {t("contact_alert_call")}
            </button>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="contact-modal-overlay" onClick={closeModal}>
          <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
            <div className="contact-modal__top">
              <div className="contact-modal__heading">
                <div className="contact-modal__heading-icon">
                  <AiOutlinePhone />
                </div>
                <div>
                  <h3 className="contact-modal__title">
                    Choose Contact Number
                  </h3>
                  <p className="contact-modal__subtitle">
                    Call the branch you need directly
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="contact-modal__close"
                onClick={closeModal}
                aria-label="Close modal"
              >
                <AiOutlineClose />
              </button>
            </div>

            <div className="contact-modal__list">
              {phoneNumbers.map((item, index) => (
                <div className="contact-modal__item" key={index}>
                  <div className="contact-modal__item-left">
                    <div className="contact-modal__item-icon">
                      <IoLocationOutline />
                    </div>

                    <div className="contact-modal__item-text">
                      <h4>{item.title}</h4>
                      <p>{item.number}</p>
                    </div>
                  </div>

                  <a href={item.link} className="contact-modal__call-btn">
                    <AiOutlinePhone />
                    <span>Call</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactHeader;
