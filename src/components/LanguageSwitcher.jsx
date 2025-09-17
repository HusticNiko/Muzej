import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher = ({ variant = 'button' }) => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = i18n.language;

  if (variant === 'dropdown') {
    return (
      <div className="language-switcher-dropdown">
        <select 
          value={currentLanguage} 
          onChange={(e) => changeLanguage(e.target.value)}
          className="language-select"
        >
          <option value="en">{t('english')}</option>
          <option value="sl">{t('slovenian')}</option>
        </select>
      </div>
    );
  }

  if (variant === 'toggle') {
    return (
      <div className="language-switcher-toggle">
        <button
          onClick={() => changeLanguage(currentLanguage === 'en' ? 'sl' : 'en')}
          className="language-toggle-btn"
        >
          {currentLanguage === 'en' ? '🇸🇮 SL' : '🇬🇧 EN'}
        </button>
      </div>
    );
  }

  // Default button variant
  return (
    <div className="language-switcher-buttons">
      <button
        onClick={() => changeLanguage('en')}
        className={`language-btn ${currentLanguage === 'en' ? 'active' : ''}`}
      >
        🇬🇧 EN
      </button>
      <button
        onClick={() => changeLanguage('sl')}
        className={`language-btn ${currentLanguage === 'sl' ? 'active' : ''}`}
      >
        🇸🇮 SL
      </button>
    </div>
  );
};

export default LanguageSwitcher;