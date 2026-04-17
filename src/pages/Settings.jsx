import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Settings({ changeTheme, currentTheme }) {
  const { userData, logout } = useAuth();

  return (
    <section className="card">
      <h2 style={{ marginBottom: '20px' }}>Settings ⚙️</h2>
      
      <div style={{ marginBottom: '30px' }}>
        <h3>Profile Info</h3>
        <p><strong>Name:</strong> {userData?.name}</p>
        <p><strong>Email:</strong> {userData?.email}</p>
        <p><strong>Connection Code:</strong> <span style={{ background: '#eee', padding: '2px 6px', borderRadius: '4px' }}>{userData?.connectionCode}</span></p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>Theme Preferences</h3>
        <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
           <button onClick={() => changeTheme('romantic')} className={`primary-btn ${currentTheme !== 'romantic' && 'secondary-btn'}`}>🌸 Romantic</button>
           <button onClick={() => changeTheme('light')} className={`primary-btn ${currentTheme !== 'light' && 'secondary-btn'}`}>☀️ Light</button>
           <button onClick={() => changeTheme('dark')} className={`primary-btn ${currentTheme !== 'dark' && 'secondary-btn'}`}>🌙 Dark</button>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
         <button onClick={logout} style={{ background: '#ff4d4f', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            Logout 🚪
         </button>
      </div>
    </section>
  );
}
