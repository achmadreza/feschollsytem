"use client";

import { IconLanguage } from "@tabler/icons-react";
import { useTranslation } from "./LanguageProvider";

export function LanguageSwitcher() {
  const { lang, setLang, availableLanguages } = useTranslation();

  const current =
    availableLanguages.find((l) => l.code === lang) ?? availableLanguages[0];

  return (
    <div className="nav-item dropdown me-3">
      <button
        className="btn btn-outline-secondary d-flex align-items-center"
        type="button"
        data-bs-toggle="dropdown"
      >
        <span className="me-1">
          {current.flag ? `${current.flag} ` : null}
          {current.code.toUpperCase()}
        </span>
      </button>
      <div className="dropdown-menu dropdown-menu-end">
        <h6 className="dropdown-header">Language</h6>
        {availableLanguages.map((lng) => (
          <button
            key={lng.code}
            type="button"
            onClick={() => setLang(lng.code)}
            className={
              "dropdown-item d-flex align-items-center" +
              (lng.code === lang ? " active" : "")
            }
          >
            <span className="me-2">{lng.flag}</span>
            <span>{lng.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
