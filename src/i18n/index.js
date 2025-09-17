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
      "back": "Nazaj na meni",
      "home": "Home",
      "about": "About",
      "contact": "Contact",
      "language": "Language",
      "english": "English",
      "slovenian": "Slovenščina",
      "change_language": "Change Language",
       "welcome_to_museum": "Welcome to Museum",
      "select_user_type": "Please select your user type",
      "customer": "Customer",
      "admin": "Administrator",
      "customer_description": "Access museum exhibitions and information",
      "admin_description": "Administrative access with special privileges",
      "admin_login": "Administrator Login",
      "enter_passcode": "Enter Passcode",
      "passcode_placeholder": "Enter your passcode",
      "incorrect_passcode": "Incorrect passcode. Please try again.",
      "cancel": "Cancel",
      "login": "Login",
      "logging_in": "Logging in...",
      "logout": "Logout",
      "customer_menu": "Customer Menu",
      "admin_menu": "Administrator Menu",
      "welcome_customer": "Welcome! Explore our museum.",
      "welcome_admin": "Administrator Panel",
      "projection_with_subtitles": "Projection with Subtitles",
      "projection_without_subtitles": "Projection without Subtitles",
      "projection_with_subtitles_desc": "Start multimedia presentation with subtitles",
      "projection_without_subtitles_desc": "Start multimedia presentation without subtitles",
      "exhibitions": "Exhibitions",
      "collections": "Collections",
      "tours": "Tours",
      "information": "Information",
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
      "back": "Back to Menu",
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