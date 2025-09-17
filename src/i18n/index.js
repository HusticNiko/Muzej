import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Common UI elements
      "welcome": "Welcome",
      "home": "Home",
      "about": "About",
      "contact": "Contact",
      "language": "Language",
      "english": "English",
      "slovenian": "Slovenščina",
      "change_language": "Change Language",
      // Add more translations as needed
    }
  },
  sl: {
    translation: {
      // Common UI elements
      "welcome": "Dobrodošli",
      "home": "Domov",
      "about": "O nas",
      "contact": "Kontakt",
      "language": "Jezik",
      "english": "Angleščina",
      "slovenian": "Slovenščina",
      "change_language": "Spremeni jezik",
      // Add more translations as needed
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;