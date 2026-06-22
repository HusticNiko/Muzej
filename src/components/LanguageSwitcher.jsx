import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n} = useTranslation();

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="language-switcher-dropdown">
      <select 
        value={i18n.language} 
        onChange={changeLanguage}
        style={{
          background: 'rgba(20, 12, 8, 0.9)',
          color: '#f3e7cc',
          border: '1px solid rgba(214, 179, 106, 0.3)',
          borderRadius: '10px',
          padding: '8px 12px',
          fontFamily: '"Cinzel", Georgia, serif',
          fontSize: '1rem',
          outline: 'none',
          cursor: 'pointer'
        }}
      >
        <option value="sl">{('Slovenščina')}</option>
<option value="en">{('English')}</option>
<option value="de">{('Deutsch')}</option>
<option value="it">{('Italiano')}</option>
<option value="hr">{('Hrvatski')}</option>
<option value="fr">{('Français')}</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;