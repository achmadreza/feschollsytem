"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { LanguageCode, languages, translate } from "../../config/i18n";

type TranslationContextValue = {
  lang: LanguageCode;
  setLang: (code: LanguageCode) => void;
  t: (key: string) => string;
  availableLanguages: typeof languages;
};

const TranslationContext = createContext<TranslationContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "daf-active-language";
const DEFAULT_LANG: LanguageCode = "en";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>(DEFAULT_LANG);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
      if (stored === "en" || stored === "id") {
        setLangState(stored);
      }
    } catch (e) {
      console.warn("Cannot read language from localStorage", e);
    }
  }, []);

  const setLang = (code: LanguageCode) => {
    setLangState(code);
    try {
      window.localStorage.setItem(STORAGE_KEY, code);
    } catch (e) {
      console.warn("Cannot write language to localStorage", e);
    }
  };

  const value = useMemo<TranslationContextValue>(
    () => ({
      lang,
      setLang,
      t: (key: string) => translate(lang, key),
      availableLanguages: languages,
    }),
    [lang]
  );

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(TranslationContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within LanguageProvider");
  }
  return ctx;
}
