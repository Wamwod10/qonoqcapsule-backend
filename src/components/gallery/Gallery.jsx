import React from "react";
import "./gallery.scss";
import { useTranslation } from "react-i18next";

import img12 from "/12.jpg";
import img13 from "/13.jpg";
import img14 from "/14.jpg";
import img15 from "/15.jpg";
import img16 from "/16.jpg";
import img17 from "/17.jpg";
import img18 from "/18.jpg";

import img19 from "/19.jpg";
import img20 from "/20.jpg";
import img21 from "/21.jpg";
import img22 from "/22.jpg";
import img23 from "/23.jpg";
import img24 from "/24.jpg";
import img25 from "/25.jpg";

const topImages = [img12, img13, img14, img15, img16, img17, img18];
const bottomImages = [img19, img20, img21, img22, img23, img24, img25];

const Gallery = () => {
  const { t } = useTranslation();
  return (
    <div className="gallery">
      <div className="container">
        <h2 className="qonoq__title">{t("gallery")}</h2>

        <div className="gallery__box">
          {/* Fade shadowlar */}
          <div className="gallery__fade gallery__fade--left" />
          <div className="gallery__fade gallery__fade--right" />

          {/* 1-qator (12–18) o‘ngdan chapga yuradi */}
          <div className="gallery__row gallery__row--top">
            <div className="gallery__track">
              {[...topImages, ...topImages].map((src, index) => (
                <div className="gallery__item" key={`top-${index}`}>
                  <div className="gallery__card">
                    <img src={src} alt={`Qonoq capsule ${index + 1}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2-qator (19–25) chapdan o‘ngga yuradi */}
          <div className="gallery__row gallery__row--bottom">
            <div className="gallery__track">
              {[...bottomImages, ...bottomImages].map((src, index) => (
                <div className="gallery__item" key={`bottom-${index}`}>
                  <div className="gallery__card">
                    <img src={src} alt={`Qonoq team ${index + 1}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
