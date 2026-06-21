import React, { useEffect, useRef, useState } from "react";
import "./sendmessage.scss";
import { LuSend } from "react-icons/lu";
import { FaChevronDown } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { BRANCH_ORDER } from "../../../../data/bookingConfig";

const API_URL =
  import.meta.env.VITE_API_URL || "https://qonoqcapsule-backend.onrender.com";

const CustomSelect = ({
  label,
  name,
  value,
  placeholder,
  options,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const closeSelect = (event) => {
      if (!selectRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", closeSelect);
    return () => document.removeEventListener("mousedown", closeSelect);
  }, []);

  const handleSelect = (nextValue) => {
    onChange({ target: { name, value: nextValue } });
    setIsOpen(false);
  };

  return (
    <div className="sendmessage__form-group" ref={selectRef}>
      <label>{label}</label>
      <button
        type="button"
        className={`sendmessage__select-trigger${value ? "" : " is-placeholder"}${
          isOpen ? " is-open" : ""
        }`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>{selectedOption?.label || placeholder}</span>
        <FaChevronDown className="sendmessage__select-icon" />
      </button>

      {isOpen && (
        <div className="sendmessage__select-menu" role="listbox">
          {options.map((option) => (
            <button
              type="button"
              className={`sendmessage__select-option${
                option.value === value ? " is-selected" : ""
              }`}
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const SendMessage = () => {
  const { t } = useTranslation();
  const submitLockRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    branch: "",
    method: "",
    message: "",
  });

  const branchOptions = BRANCH_ORDER.map((branch) => ({
    value: branch.key,
    label: t(branch.labelKey, {
      defaultValue: branch.fallbackLabel,
    }),
  }));

  const methodOptions = [
    { value: "telegram", label: t("send_method_telegram") },
    { value: "email", label: t("send_method_email") },
    { value: "whatsapp", label: t("send_method_whatsapp") },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitLockRef.current) return;
    submitLockRef.current = true;
    setIsSubmitting(true);

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
      console.error("CONTACT FORM ERROR:", error);
      alert(t("send_error"));
    } finally {
      submitLockRef.current = false;
      setIsSubmitting(false);
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

              <CustomSelect
                label={t("send_branch")}
                name="branch"
                value={formData.branch}
                placeholder={t("send_branch_placeholder")}
                options={branchOptions}
                onChange={handleChange}
              />

              <CustomSelect
                label={t("send_method")}
                name="method"
                value={formData.method}
                placeholder={t("send_method_placeholder")}
                options={methodOptions}
                onChange={handleChange}
              />

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
                <button type="submit" disabled={!isFormValid || isSubmitting}>
                  {isSubmitting
                    ? t("sending", { defaultValue: "Sending..." })
                    : t("send_button")} {" "}
                  {!isSubmitting && <LuSend />}
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
