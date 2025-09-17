import React from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../context/UserContext';
import LanguageSwitcher from './LanguageSwitcher';
import "../styles.css";

const AdminMenu = () => {
  const { t } = useTranslation();
  const { logout } = useUser();

  const handleProjectionWithSubtitles = () => {
    console.log('Starting projection with subtitles');
    // Add your projection logic here
  };

  const handleProjectionWithoutSubtitles = () => {
    console.log('Starting projection without subtitles');
    // Add your projection logic here
  };

  return (
    <div className="menu-container">
      <div className="menu-header">
        <div className="menu-title">
          <h1>{t('admin_menu')}</h1>
          <p>{t('welcome_admin')}</p>
        </div>
        <div className="menu-controls">
          <LanguageSwitcher variant="toggle" />
          <button className="logout-btn" onClick={logout}>
            <span className="logout-icon">🚪</span>
            {t('logout')}
          </button>
        </div>
      </div>

      <div className="admin-menu-grid">
        <button
          className="admin-menu-item projection-with-subtitles"
          onClick={handleProjectionWithSubtitles}
        >
          <div className="admin-menu-icon">🎬</div>
          <div className="admin-menu-content">
            <h3>{t('projection_with_subtitles')}</h3>
            <p>{t('projection_with_subtitles_desc')}</p>
          </div>
        </button>

        <button
          className="admin-menu-item projection-without-subtitles"
          onClick={handleProjectionWithoutSubtitles}
        >
          <div className="admin-menu-icon">🎥</div>
          <div className="admin-menu-content">
            <h3>{t('projection_without_subtitles')}</h3>
            <p>{t('projection_without_subtitles_desc')}</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AdminMenu;