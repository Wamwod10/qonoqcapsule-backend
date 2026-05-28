import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./nav.scss";
import { IoHome } from "react-icons/io5";
import { TbBedFilled } from "react-icons/tb";
import { TbHelpHexagon } from "react-icons/tb";
import { BsFillBookmarksFill } from "react-icons/bs";
import { IoCall } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { PiNotebook } from "react-icons/pi";
import { Link, NavLink, useLocation } from "react-router-dom";

export default function Nav() {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const [active, setActive] = useState(0);
  const [openLang, setOpenLang] = useState(false);
  const [langTick, setLangTick] = useState(0);

  const listRef = useRef(null);
  const pillRef = useRef(null);
  const langRef = useRef(null);

  // Languages (emoji+label)
  const LANGS = [
    { code: "en", label: "English" },
    { code: "ru", label: "Русский" },
    { code: "uz", label: "O'zbek" },
  ];
  const [lang, setLang] = useState(() => {
    const code = (i18n.language || "en").split("-")[0];
    return LANGS.find((l) => l.code === code) || LANGS[0];
  });

  // Map current pathname to nav index
  const getIndexFromPath = (pathname) => {
    if (!pathname) return -1;
    // normalize trailing slash
    const p = pathname.split("?")[0].split("#")[0];
    if (p === "/" || p === "") return 0;
    if (
      p.startsWith("/capsule") ||
      p.startsWith("/tashkent-airport") ||
      p.startsWith("/samarkand-airport") ||
      p.startsWith("/samarkand-railway")
    ) {
      return 1;
    }
    if (p.startsWith("/rules")) return 2;
    if (p.startsWith("/services")) return 3;
    if (p.startsWith("/contact")) return 4;
    if (p.startsWith("/my-booking") || p.startsWith("/booking")) return 5;
    // fallback: try to detect by known keywords
    if (p.includes("services")) return 2;
    if (p.includes("rule")) return 3;
    if (p.includes("contact")) return 4;
    if (p.includes("booking") || p.includes("reservation")) return 5;
    return -1;
  };

  const movePill = (i) => {
    const wrap = listRef.current;
    const pill = pillRef.current;
    if (!wrap || !pill) return;

    const items = wrap.querySelectorAll(".nav__link");
    // if index invalid or item not found -> hide pill smoothly
    if (i < 0 || !items[i]) {
      // collapse pill
      pill.style.width = "0px";
      // keep transform as is (optional)
      return;
    }

    const el = items[i];
    if (!el) {
      pill.style.width = "0px";
      return;
    }

    const wrapRect = wrap.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    pill.style.width = r.width + "px";
    pill.style.transform = `translateX(${r.left - wrapRect.left}px)`;
  };

  // Update active index when location changes (this makes nav follow URL)
  useEffect(() => {
    const idx = getIndexFromPath(location.pathname);
    setActive(idx);
  }, [location.pathname]);

  // Active o‘zgarsa: DOM tayyor bo‘lishini kutib keyin o‘lchaymiz
  useLayoutEffect(() => {
    let raf1 = 0,
      raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => movePill(active));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [active, langTick]); // til flag ham trigger qiladi

  // Resize + til o‘zgarsa
  useEffect(() => {
    const onResize = () => movePill(active);
    window.addEventListener("resize", onResize);

    // Til o‘zgarganda hozircha o‘lchamasdan faqat flagni oshiramiz.
    const onLang = () => setLangTick((n) => n + 1);
    i18n.on("languageChanged", onLang);

    return () => {
      window.removeEventListener("resize", onResize);
      i18n.off("languageChanged", onLang);
    };
  }, [active, i18n]);

  // Matn kengligi/padding o‘zgarsa ham pill avtomatik moslashishi uchun
  useEffect(() => {
    if (!listRef.current) return;
    const ro = new ResizeObserver(() => {
      // keyingi kadrda o‘lchash – layout settle bo‘lsin
      requestAnimationFrame(() => movePill(active));
    });
    ro.observe(listRef.current);
    // har bir linkni ham kuzatsak yanada ishonchli bo‘ladi
    listRef.current
      .querySelectorAll(".nav__link")
      .forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [active, langTick]);

  // Tashqariga bosilganda lang dropdownni yopish
  useEffect(() => {
    const onDoc = (e) => {
      if (!langRef.current) return;
      if (!langRef.current.contains(e.target)) setOpenLang(false);
    };
    document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, []);

  const onLangKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      setOpenLang((v) => !v);
    }
    if (e.key === "Escape") setOpenLang(false);
  };

  const changeLang = (l) => {
    setLang(l);
    setOpenLang(false);
    i18n.changeLanguage(l.code);
  };

  // >>> Joriy tanlangan tilni menyudan yashirish (asosiy talab)
  const VISIBLE_LANGS = LANGS.filter((l) => l.code !== lang.code);

  return (
    <div className="nav">
      <div className="container">
        <div className="nav__box">
          <Link to="/" className="nav__logo">
            {/* {t("brand")} */}
            <img src="/6.png" alt="" />
          </Link>

          <ul
            className="nav__list"
            ref={listRef}
            role="tablist"
            aria-label="Main navigation"
          >
            <span className="nav__pill" ref={pillRef} aria-hidden="true" />

            <li className="nav__item" role="presentation">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav__link ${isActive ? "is-active" : ""}`
                }
                role="tab"
                aria-selected={active === 0}
                onClick={() => {
                  // optional immediate visual feedback
                  setActive(0);
                }}
                end
              >
                <IoHome className="nav__icon" /> {t("home")}
              </NavLink>
            </li>

            <li className="nav__item" role="presentation">
              <NavLink
                to="/capsule"
                className={() => `nav__link ${active === 1 ? "is-active" : ""}`}
                role="tab"
                aria-selected={active === 1}
                onClick={() => setActive(1)}
              >
                <TbBedFilled className="nav__icon"  /> {t("capsules")}
              </NavLink>
            </li>

            <li className="nav__item" role="presentation">
              {/* If services is not a route, keep anchor but highlight by pathname match */}
              <NavLink
                to="/rules"
                className={({ isActive }) =>
                  `nav__link ${isActive ? "is-active" : ""}`
                }
                role="tab"
                aria-selected={active === 2}
                onClick={() => setActive(2)}
              >
                <TbHelpHexagon className="nav__icon"  /> {t("rules")}
              </NavLink>
            </li>

            <li className="nav__item" role="presentation">
              <NavLink
                to="/services"
                className={({ isActive }) =>
                  `nav__link ${isActive ? "is-active" : ""}`
                }
                role="tab"
                aria-selected={active === 3}
                onClick={() => setActive(3)}
              >
                <BsFillBookmarksFill className="nav__icon"  /> {t("services")}
              </NavLink>
            </li>

            <li className="nav__item" role="presentation">
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `nav__link ${isActive ? "is-active" : ""}`
                }
                role="tab"
                aria-selected={active === 4}
                onClick={() => setActive(4)}
              >
                <IoCall className="nav__icon"  />
                {t("contact")}
              </NavLink>
            </li>

            <li className="nav__item" role="presentation">
              <NavLink
                to="/my-booking"
                className={({ isActive }) =>
                  `nav__link ${isActive ? "is-active" : ""}`
                }
                role="tab"
                aria-selected={active === 5}
                onClick={() => setActive(5)}
              >
                <PiNotebook className="nav__icon"  />
                {t("my_booking")}
              </NavLink>
            </li>
          </ul>

          <div className="nav__last-box">
            <div className="nav__lang" ref={langRef}>
              <button
                type="button"
                className={`nav__lang-toggle ${openLang ? "is-open" : ""}`}
                onClick={() => {
                  setOpenLang((v) => !v);
                }}
                onKeyDown={onLangKey}
                aria-haspopup="listbox"
                aria-expanded={openLang}
                aria-label={t("change_lang")}
                title={t("change_lang")}
              >
                <span className="nav__lang-flag" aria-hidden="true">
                  {lang.flag}
                </span>
                <span className="nav__lang-text">{lang.label}</span>
                <span className="nav__chev" aria-hidden>
                  ▾
                </span>
              </button>

              <ul
                className={`nav__lang-menu ${openLang ? "show" : ""}`}
                role="listbox"
                tabIndex={-1}
              >
                {VISIBLE_LANGS.map((l) => (
                  <li key={l.code} role="option" aria-selected={false}>
                    <button
                      type="button"
                      className={`nav__lang-item`}
                      onClick={() => {
                        changeLang(l);
                      }}
                    >
                      <div className="nav__lang-chip">
                        <span className="nav__lang-flag" aria-hidden="false">
                          {/* {l.flag} */}
                        </span>
                        <span className="nav__lang-text">{l.label}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="nav__booking-div">
              <Link to="/contact" className="nav__booking">
                {t("contact_now")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
