import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import "../styles.css";

const AdminLoginDialog = ({ onClose, onLogin }) => {
  const { t } = useTranslation();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // You can change this passcode or make it configurable
  const ADMIN_PASSCODE = '1234';

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate a small delay for better UX
    setTimeout(() => {
      if (passcode === ADMIN_PASSCODE) {
        onLogin(true);
      } else {
        setError(t('incorrect_passcode'));
        setPasscode('');
      }
      setIsLoading(false);
    }, 500);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="admin-dialog-overlay" onClick={handleOverlayClick}>
      <div className="admin-dialog">
        <div className="admin-dialog-header">
          <h2>{t('admin_login')}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label htmlFor="passcode">{t('enter_passcode')}</label>
            <input
              type="password"
              id="passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder={t('passcode_placeholder')}
              className={error ? 'error' : ''}
              disabled={isLoading}
              autoFocus
            />
            {error && <span className="error-message">{error}</span>}
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={onClose}
              disabled={isLoading}
            >
              {t('cancel')}
            </button>
            <button 
              type="submit" 
              className="login-btn"
              disabled={!passcode || isLoading}
            >
              {isLoading ? t('logging_in') : t('login')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginDialog;