"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "@/lib/i18n";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("landlinkx_lang");
    if (saved && (saved === "en" || saved === "ta")) {
      setLang(saved);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === "en" ? "ta" : "en";
    setLang(newLang);
    localStorage.setItem("landlinkx_lang", newLang);
  };

  const t = translations[lang] || translations.en;

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      lang: "en",
      toggleLanguage: () => {},
      t: translations.en
    };
  }
  return context;
}
