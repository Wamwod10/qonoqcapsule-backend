import React, { useEffect, useState } from "react";
import { FaLocationArrow, FaMoneyBillWave } from "react-icons/fa6";
import { LuExternalLink } from "react-icons/lu";
import { AiOutlineClose } from "react-icons/ai";
import { IoLocationOutline } from "react-icons/io5";
import { MdAccountBalance, MdAirplaneTicket, MdCurrencyExchange } from "react-icons/md";
import { useTranslation } from "react-i18next";
import "./contactform.scss";

const ContactForm = () => {
  const { t } = useTranslation();
  const [isDirectionsModalOpen, setIsDirectionsModalOpen] = useState(false);

  const directionsLocations = [
    {
      title: t("contact_branch_tashkent_airport"),
      subtitle: t("contact_branch_tashkent_airport_address"),
      link: "https://maps.google.com/?q=Tashkent+International+Airport+Departure+Area+2nd+Floor",
    },
    {
      title: t("contact_branch_samarkand_airport"),
      subtitle: t("contact_branch_samarkand_airport_address"),
      link: "https://maps.google.com/?q=Samarkand+International+Airport",
    },
    {
      title: t("contact_branch_samarkand_railway"),
      subtitle: t("contact_branch_samarkand_railway_address"),
      link: "https://maps.google.com/?q=Samarkand+Railway+Station",
    },
  ];

  const openDirectionsModal = () => {
    setIsDirectionsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeDirectionsModal = () => {
    setIsDirectionsModalOpen(false);
    document.body.style.overflow = "unset";
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeDirectionsModal();
      }
    };

    if (isDirectionsModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isDirectionsModalOpen]);

  return (
    <>
    <div className="contactform">
      <div className="container">
        <div className="contactform__box">
          <div className="contactform__title-box">
            <h2 className="contactform__title">
              {t("contact_location_title")}
            </h2>
            <button
              type="button"
              className="contactform__link"
              onClick={openDirectionsModal}
            >
              <FaLocationArrow /> {t("contact_get_directions")}
            </button>
          </div>

          <div className="contactform__map-box">
            <img
              className="contactform__map"
              src="/12.jpg"
              alt={t("contact_hotel_name")}
            />

            <div className="contactform__map-div">
              <h3 className="contactform__map-title">
                {t("contact_hotel_name")}
              </h3>
              <p className="contactform__map-text">
                {t("contact_hotel_address")}
              </p>
            </div>
          </div>

          <div className="contactform__nears">
            <h3 className="contactform__nears-title">
              {t("contact_nearby_title")}
            </h3>

            <div className="contactform__nears-box">
              <div className="contactform__nears-div">
                <div className="contactform__titles-div">
                  <div className="contactform__nears-icon">
                    <MdCurrencyExchange className="icon icon-rotate" />
                  </div>
                  <div>
                    <h3 className="contactform__div-title">
                      {t("contact_near_dutyfree")}
                    </h3>
                    <p className="contactform__div-text">200–300 m</p>
                  </div>
                </div>
                <a
                  href="https://www.google.com/maps/place/Duty+Free+Uzbekistan/"
                  className="contactform__nears-icon"
                >
                  <LuExternalLink className="icon" />
                </a>
              </div>

              <div className="contactform__nears-div">
                <div className="contactform__titles-div">
                  <div className="contactform__nears-icon">
                    <MdAccountBalance className="icon icon-rotate" />
                  </div>
                  <div>
                    <h3 className="contactform__div-title">
                      {t("contact_near_dining")}
                    </h3>
                    <p className="contactform__div-text">150–250 m</p>
                  </div>
                </div>
                <a
                  href="https://www.google.com/maps/place/Pie+republic+airport/"
                  className="contactform__nears-icon"
                >
                  <LuExternalLink className="icon" />
                </a>
              </div>

              <div className="contactform__nears-div">
                <div className="contactform__titles-div">
                  <div className="contactform__nears-icon">
                    <MdAirplaneTicket className="icon icon-rotate" />
                  </div>
                  <div>
                    <h3 className="contactform__div-title">
                      {t("contact_near_post")}
                    </h3>
                    <p className="contactform__div-text">300–350 m</p>
                  </div>
                </div>
                <a
                  href="https://www.google.com/maps/place/post+office+in+airport+tashkent"
                  className="contactform__nears-icon"
                >
                  <LuExternalLink className="icon" />
                </a>
              </div>

              <div className="contactform__nears-div">
                <div className="contactform__titles-div">
                  <div className="contactform__nears-icon">
                    <FaMoneyBillWave className="icon icon-rotate" />
                  </div>
                  <div>
                    <h3 className="contactform__div-title">
                      {t("contact_near_taxi")}
                    </h3>
                    <p className="contactform__div-text">50–100 m</p>
                  </div>
                </div>
                <a
                  href="https://www.google.com/maps/place/Taxi+Airport+Tashkent/"
                  className="contactform__nears-icon"
                >
                  <LuExternalLink className="icon" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {isDirectionsModalOpen && (
      <div className="contact-modal-overlay" onClick={closeDirectionsModal}>
        <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
          <div className="contact-modal__top">
            <div className="contact-modal__heading">
              <div className="contact-modal__heading-icon">
                <FaLocationArrow />
              </div>
              <div>
                <h3 className="contact-modal__title">
                  {t("contact_directions_modal_title")}
                </h3>
                <p className="contact-modal__subtitle">
                  {t("contact_directions_modal_subtitle")}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="contact-modal__close"
              onClick={closeDirectionsModal}
              aria-label="Close modal"
            >
              <AiOutlineClose />
            </button>
          </div>

          <div className="contact-modal__list">
            {directionsLocations.map((item, index) => (
              <div className="contact-modal__item" key={index}>
                <div className="contact-modal__item-left">
                  <div className="contact-modal__item-icon">
                    <IoLocationOutline />
                  </div>

                  <div className="contact-modal__item-text">
                    <h4>{item.title}</h4>
                    <p>{item.subtitle}</p>
                  </div>
                </div>

                <a
                  href={item.link}
                  className="contact-modal__call-btn"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaLocationArrow />
                  <span>{t("contact_modal_open_map")}</span>
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

export default ContactForm;
