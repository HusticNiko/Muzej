import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../context/UserContext';
import AdminLoginDialog from './AdminLoginDialog';
import LanguageSwitcher from './LanguageSwitcher';
import viki from '../assets/Viki_Mitra1.png';
import srecka from '../assets/Srecka_Fortuna.png';
import "../styles.css";

const UserSelection = () => {
  const { t, i18n } = useTranslation();
  const { login } = useUser();
  const [showAdminDialog, setShowAdminDialog] = useState(false);

  return (
    <div className="user-selection-container">
      
      {/* --- LIKA OB STRANEH --- */}
      <img src={viki} alt="Viki" className="menu-character left-character" draggable="false" />
      <img src={srecka} alt="Srečka" className="menu-character right-character" draggable="false" />

      {/* GUMB PROJEKCIJA */}
      <button 
        className="user-option-btn admin-btn projekcija-btn"
        onClick={() => setShowAdminDialog('projekcija')}
      >
        {t('Projekcija')}
      </button>
      {/* SREDINSKI MENI */}
      <div className="user-selection-content lang-fade" key={i18n.language}>
        <div className="welcome-section">
          <h1 className="welcome-title">{t('welcome_to_museum')}</h1>
          <p className="welcome-subtitle">{t('select_user_type')}</p>
        </div>

        <div className="user-options">
          <button 
            className="user-option-btn customer-btn"
            onClick={() => login('kviz_mitraizem')}
          >
            <div className="user-icon">←</div>
            <h3>{t('btn_mitra')}</h3>
          </button>

          <button 
            className="user-option-btn customer-btn light-menu-btn"
            onClick={() => login('kviz_ostala_bozanstva')}
          >
            <div className="user-icon">→</div>
            <h3>{t('btn_splosni')}</h3>
          </button>
        </div>
      </div>

      {/* POJAVNO OKNO ZA GESLO */}
      {showAdminDialog && (
        <AdminLoginDialog 
          onClose={() => setShowAdminDialog(false)}
          onLogin={() => {
            if (showAdminDialog === 'projekcija') {
                login('projekcija');
            }
          }}
        />
      )}
    </div>
  );
};

export default UserSelection;