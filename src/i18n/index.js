import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Common UI elements
      "welcome": "Dobrodošli v templju Fortuna",
      "trial_of_mithras": "Sojenje Mitri",
      "mysteri_of_skyes": "Skrivnostno ozvezdje",
      "stage1": "Katero bitje je povezano s stopnjo Corax?",
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
      "welcome": "Welcome to Fortuna Temple's",
      "stage1": "What creature is associated with the Corax stage?",
      "trial_of_mithras": "Trial of Mithras",
      "mysteri_of_skyes": "Mysteries of the Starry Sky",
      "home": "Domov",
      "about": "O nas",
      "contact": "Kontakt",
      "language": "Jezik",
      "english": "Angleščina",
      "slovenian": "Slovenščina",
      "change_language": "Spremeni jezik",
      "war": "vojna",
      "What creature is associated with the Corax stage?": "test",
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