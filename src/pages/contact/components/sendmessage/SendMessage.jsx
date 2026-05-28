import React, { useState } from "react";
import "./sendmessage.scss";
import { LuSend } from "react-icons/lu";
import { FaChevronDown } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { BRANCH_ORDER } from "../../../../data/bookingConfig";

const API_URL =
  import.meta.env.VITE_API_URL || "https://qonoqcapsule-backend.onrender.com";

const SendMessage = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    branch: "",
    method: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedBranch = BRANCH_ORDER.find(
      (branch) => branch.key === formData.branch,
    );
    const branchLabel = selectedBranch
      ? t(selectedBranch.labelKey, {
          defaultValue: selectedBranch.fallbackLabel,
        })
      : formData.branch;

    const text = `📩 Yangi xabar:
👤 Ism: ${formData.fullName}
📧 Email: ${formData.email}
📞 Telefon: ${formData.phone}
📍 Filial: ${branchLabel}
💬 Aloqa usuli: ${formData.method}
📝 Xabar: ${formData.message}`;

    try {
      const response = await fetch(`${API_URL}/notify/telegram`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          branch: formData.branch,
          branchLabel,
          method: formData.method,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        throw new Error("Telegram notification failed");
      }

      alert(t("send_success"));

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        branch: "",
        method: "",
        message: "",
      });
    } catch (error) {
      alert(t("send_error"));
    }
  };

  const isFormValid =
    formData.fullName.trim() &&
    formData.email.trim() &&
    formData.phone.trim() &&
    formData.branch.trim() &&
    formData.method.trim() &&
    formData.message.trim();

  return (
    <div className="sendmessage">
      <div className="container">
        <div className="sendmessage__box">
          <h2 className="sendmessage__title">{t("send_title")}</h2>
          <p className="sendmessage__text">{t("send_subtitle")}</p>

          <form className="sendmessage-form" onSubmit={handleSubmit}>
            <div className="sendmessage__form-box">
              <div className="sendmessage__form-group">
                <label>{t("send_full_name")}</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder={t("send_full_name_placeholder")}
                  required
                />
              </div>

              <div className="sendmessage__form-group">
                <label>{t("send_email")}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t("send_email_placeholder")}
                  required
                />
              </div>

              <div className="sendmessage__form-group">
                <label>{t("send_phone")}</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t("send_phone_placeholder")}
                  required
                />
              </div>

              <div className="sendmessage__form-group">
                <label>{t("send_branch")}</label>
                <select
                  className="sendmessage__branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    {t("send_branch_placeholder")}
                  </option>
                  {BRANCH_ORDER.map((branch) => (
                    <option value={branch.key} key={branch.key}>
                      {t(branch.labelKey, {
                        defaultValue: branch.fallbackLabel,
                      })}
                    </option>
                  ))}
                </select>
                <FaChevronDown className="select-icon" />
              </div>

              <div className="sendmessage__form-group">
                <label>{t("send_method")}</label>
                <select
                  className="sendmessage__methods"
                  name="method"
                  value={formData.method}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    {t("send_method_placeholder")}
                  </option>
                  <option value="telegram">{t("send_method_telegram")}</option>
                  <option value="email">{t("send_method_email")}</option>
                  <option value="whatsapp">{t("send_method_whatsapp")}</option>
                </select>
                <FaChevronDown className="select-icon" />
              </div>
            </div>

            <div className="sendmessage__form">
              <label>{t("send_message_label")}</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t("send_message_placeholder")}
                required
              />

              <div className="sendmessage__form-but">
                <button type="submit" disabled={!isFormValid}>
                  {t("send_button")} <LuSend />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SendMessage;
