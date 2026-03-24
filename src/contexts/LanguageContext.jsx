import React, { createContext, useContext, useState } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  // t('worldmap.title') → translations[lang].worldmap.title
  function t(path) {
    const parts = path.split('.');
    let val = translations[lang];
    for (const p of parts) {
      val = val?.[p];
    }
    return val ?? path;
  }

  // Returns country name in the current language using Intl.DisplayNames
  function countryName(iso) {
    try {
      return new Intl.DisplayNames([lang], { type: 'region' }).of(iso) ?? iso;
    } catch {
      return iso;
    }
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, countryName }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
