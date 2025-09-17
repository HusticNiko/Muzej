import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../context/UserContext';
import AdminLoginDialog from './AdminLoginDialog';
import LanguageSwitcher from './LanguageSwitcher';
import './UserSelection.css';

const UserSelection = () => {
  const { t } = useTranslation();
  const { login } = useUser();
  const [showAdminDialog, setShowAdminDialog] = useState(false);

  const handleCustomerSelect = () => {
    login('customer');
  };

  const handleAdminSelect = () => {
    setShowAdminDialog(true);
  };

  const handleAdminLogin = (success) => {
    setShowAdminDialog(false);
    if (success) {
      login('admin');
    }
  };

  return (
    <div className="user-selection-container">
      <div className="language-switcher-top">
        <LanguageSwitcher variant="toggle" />
      </div>
      
      <div className="user-selection-content">
        <div className="welcome-section">
          <h1 className="welcome-title">{t('welcome_to_museum')}</h1>
          <p className="welcome-subtitle">{t('select_user_type')}</p>
        </div>

        <div className="user-options">
          <button 
            className="user-option-btn customer-btn"
            onClick={handleCustomerSelect}
          >
            <div className="user-icon">👤</div>
            <h3>{t('customer')}</h3>
            <p>{t('customer_description')}</p>
          </button>

          <button 
            className="user-option-btn admin-btn"
            onClick={handleAdminSelect}
          >
            <div className="user-icon">🔐</div>
            <h3>{t('admin')}</h3>
            <p>{t('admin_description')}</p>
          </button>
        </div>
      </div>

      {showAdminDialog && (
        <AdminLoginDialog 
          onClose={() => setShowAdminDialog(false)}
          onLogin={handleAdminLogin}
        />
      )}
    </div>
  );
};

export default UserSelection;