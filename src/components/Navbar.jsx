import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ changeTheme, currentTheme }) {
  const { userData, logout } = useAuth();

  const handleThemeChange = (theme) => {
    changeTheme(theme);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-greeting">
          Hey <span className="name-you">{userData?.name || 'You'}</span> ❤️ <span className="name-partner">Partner</span>
        </h1>
      </div>
      <div className="topbar-right">
        <div className="theme-switcher">
          <button className={`theme-btn ${currentTheme === 'romantic' ? 'active' : ''}`} onClick={() => handleThemeChange('romantic')} title="Soft Romantic">
            <span>🌸</span>
          </button>
          <button className={`theme-btn ${currentTheme === 'light' ? 'active' : ''}`} onClick={() => handleThemeChange('light')} title="Clean Light">
            <span>☀️</span>
          </button>
          <button className={`theme-btn ${currentTheme === 'dark' ? 'active' : ''}`} onClick={() => handleThemeChange('dark')} title="Dark Intimate">
            <span>🌙</span>
          </button>
        </div>
        <div className="profile-dropdown">
          <button className="profile-btn">
            <div className="profile-avatar">{userData?.name?.[0]?.toUpperCase() || 'U'}</div>
          </button>
        </div>
      </div>
    </header>
  );
}
