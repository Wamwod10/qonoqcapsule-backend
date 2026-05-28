import React, { useEffect, useMemo, useState } from "react";
import "./capstype.scss";
import {
  FaFan,
  FaLocationArrow,
  FaLock,
  FaPlug,
  FaUserAlt,
} from "react-icons/fa";
import { TbArrowAutofitHeight } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import { MdLightMode, MdPowerSettingsNew, MdWifi } from "react-icons/md";
import CapsModal from "./CapsModal";
import {
  DURATION_OPTIONS,
  formatPriceLabel,
  getAvailableCapsuleTypes,
  getCapsulePrice,
  getDefaultCapsuleType,
  isCapsuleTypeAvailable,
  STORAGE_KEY,
  getCapsuleImages, // 🔥 NEW
} from "../../../../data/bookingConfig";

const Capstype = ({ branchConfig }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [hasBooking, setHasBooking] = useState(false);
  const [mainImages, setMainImages] = useState({});

  const capsuleCards = useMemo(
    () => getAvailableCapsuleTypes(branchConfig?.key),
    [branchConfig?.key],
  );

  // 🔥 IMAGE LOGIC (FIXED)
  useEffect(() => {
    const imagesMap = Object.fromEntries(
      capsuleCards.map((card) => {
        const images = getCapsuleImages(branchConfig.key, card.key);
        return [card.key, images[0] || ""];
      }),
    );

    setMainImages(imagesMap);
  }, [capsuleCards, branchConfig.key]);

  useEffect(() => {
    try {
      const data = sessionStorage.getItem(STORAGE_KEY);

      if (!data) {
        setSelectedType(getDefaultCapsuleType(branchConfig?.key));
        setHasBooking(false);
        return;
      }

      const parsed = JSON.parse(data);
      const nextType = parsed?.capsuleTypeValue || null;

      setSelectedType(
        isCapsuleTypeAvailable(branchConfig?.key, nextType)
          ? nextType
          : getDefaultCapsuleType(branchConfig?.key),
      );
      setHasBooking(Boolean(parsed?.capsuleTypeValue));
    } catch {
      setSelectedType(getDefaultCapsuleType(branchConfig?.key));
      setHasBooking(false);
    }
  }, [branchConfig?.key]);

  return (
    <>
      <div className="capstype">
        <div className="container">
          <h2 className="qonoq__title">
            {t("capsules_branch_title", {
              branch: t(branchConfig.labelKey, {
                defaultValue: branchConfig.fallbackLabel,
              }),
              defaultValue: `${branchConfig.fallbackLabel} Capsules`,
            })}
          </h2>

          <div className="capstype__box">
            {capsuleCards.map((card) => {
              const images = getCapsuleImages(
                branchConfig.key,
                card.key,
              );

              const currentMain =
                mainImages[card.key] || images[0];

              return (
                <div className="capstype__card" key={card.key}>
                  <div>
                    <img
                      className="capstype__img"
                      src={currentMain}
                      alt={t(card.cardTitleKey, {
                        defaultValue: card.fallbackTitle,
                      })}
                    />

                    <div className="capstype__thumbs">
                      {images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={t(card.cardTitleKey, {
                            defaultValue: card.fallbackTitle,
                          })}
                          className={`capstype__thumb ${
                            currentMain === img ? "active" : ""
                          }`}
                          onClick={() =>
                            setMainImages((prev) => ({
                              ...prev,
                              [card.key]: img,
                            }))
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <div className="capstype__div">
                    <h2 className="capstype__title">
                      {t(card.cardTitleKey, {
                        defaultValue: card.fallbackTitle,
                      })}
                    </h2>

                    <div className="caps__info-card">
                      <p className="caps__card-guest">
                        <FaUserAlt className="caps__icon" />{" "}
                        {t(card.guestsKey)}
                      </p>
                      <p className="caps__card-guest">
                        <TbArrowAutofitHeight className="caps__icon" />{" "}
                        {t(card.sizeKey)}
                      </p>
                    </div>

                    <a href="#!" className="caps__card-guest capstype__location">
                      <FaLocationArrow className="caps__icon" />{" "}
                      {t(branchConfig.capsuleLocationKey, {
                        defaultValue:
                          branchConfig.fallbackCapsuleLocation,
                      })}
                    </a>

                    <p className="capstype__text">
                      {t(card.descriptionKey)}
                    </p>

                    <div className="capstype__prices">
                      {DURATION_OPTIONS.map((durationValue) => (
                        <a
                          href="#!"
                          className="capstype__price-link"
                          key={durationValue}
                        >
                          {formatPriceLabel(
                            t,
                            durationValue,
                            getCapsulePrice(
                              branchConfig.key,
                              card.key,
                              durationValue,
                            ),
                          )}
                        </a>
                      ))}
                    </div>

                    <div className="caps__card-features">
                      <h2 className="caps__ft-title">
                        {t("capsules_features_title")}
                      </h2>

                      <div className="caps__features">
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
                      </div>

                      <div className="capstype__link-div">
                        <button
                          className="qonoq__big-link capstype__link"
                          disabled={
                            !hasBooking || selectedType !== card.key
                          }
                          onClick={() => setIsModalOpen(true)}
                        >
                          {t("capsules_btn_booking")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <CapsModal onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

export default Capstype;