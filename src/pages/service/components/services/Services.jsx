import React from "react";
import "./services.scss";
import { FaChargingStation } from "react-icons/fa";
import {
  MdAccessTime,
  MdAir,
  MdFlightTakeoff,
  MdLightbulbOutline,
  MdOutlineDoNotDisturb,
  MdOutlineLock,
  MdOutlineSanitizer,
  MdOutlineTouchApp,
  MdSupportAgent,
  MdVideocam,
  MdVolumeOff,
} from "react-icons/md";
import { useTranslation } from "react-i18next";
import { IoIosTv } from "react-icons/io";
import { SiRailway } from "react-icons/si";

const Services = () => {
  const { t } = useTranslation();

  const servicesData = [
    {
      icon: <MdOutlineTouchApp />,
      title: t("service_1_title"),
      desc: t("service_1_desc"),
      tag: t("service_1_tag"),
    },
    {
      icon: <MdVolumeOff />,
      title: t("service_2_title"),
      desc: t("service_2_desc"),
      tag: t("service_2_tag"),
    },
    {
      icon: <MdLightbulbOutline />,
      title: t("service_3_title"),
      desc: t("service_3_desc"),
      tag: t("service_3_tag"),
    },
    {
      icon: <MdAir />,
      title: t("service_4_title"),
      desc: t("service_4_desc"),
      tag: t("service_4_tag"),
    },
    {
      icon: <MdOutlineDoNotDisturb />,
      title: t("service_5_title"),
      desc: t("service_5_desc"),
      tag: t("service_5_tag"),
    },
    {
      icon: <MdSupportAgent />,
      title: t("service_6_title"),
      desc: t("service_6_desc"),
      tag: t("service_6_tag"),
    },
    {
      icon: <FaChargingStation />,
      title: t("service_7_title"),
      desc: t("service_7_desc"),
      tag: t("service_7_tag"),
    },
    {
      icon: <MdVideocam />,
      title: t("service_8_title"),
      desc: t("service_8_desc"),
      tag: t("service_8_tag"),
    },
    {
      icon: <MdOutlineLock />,
      title: t("service_9_title"),
      desc: t("service_9_desc"),
      tag: t("service_9_tag"),
    },
    {
      icon: <IoIosTv />,
      title: t("service_11_title"),
      desc: t("service_11_desc"),
      tag: t("service_11_tag"),
    },
    {
      icon: <MdFlightTakeoff />,
      title: t("service_10_title"),
      desc: t("service_10_desc"),
      tag: t("service_10_tag"),
    },
    {
      icon: <SiRailway />,
      title: t("service_12_title"),
      desc: t("service_12_desc"),
      tag: t("service_12_tag"),
    }
  ];

  return (
    <section className="services">
      <div className="container">
        <div className="services__header">
          <h2>{t("services_title")}</h2>
          <p>{t("services_subtitle")}</p>
        </div>

        <div className="services__grid">
          {servicesData.map((item, index) => (
            <div className="service__card" key={index}>
              <div className="service__icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <span className="service__tag">{item.tag}</span>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
