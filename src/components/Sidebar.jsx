import React from 'react';
import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const { logout } = useAuth();
  
  const mainItems = [
    { id: '', icon: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z', label: 'Dashboard' },
    { id: 'our-space', icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z', label: 'Our Space ❤️' },
    { id: 'memories', icon: 'M3 3h18v18H3z', circle: '8.5 8.5 1.5', polyline: '21 15 16 10 5 21', label: 'Memories 📸' },
    { id: 'love-chat', icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z', label: 'Love Chat 💬', badge: '3', badgeClass: 'nav-badge' },
    { id: 'special-dates', icon: 'M3 4h18v18H3z', d: 'M16 2v4M8 2v4M3 10h18', label: 'Special Dates 🎉' },
    { id: 'mood', icon: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z', d: 'M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01', label: 'Mood 😊' },
    { id: 'love-stats', polyline: '22 12 18 12 15 21 9 3 6 12 2 12', label: 'Love Stats ❤️‍🔥' },
  ];

  const secondaryItems = [
    { id: 'love-draw', icon: 'M12 19l7-7 3 3-7 7-3-3z M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z', d: 'M2 2l7.586 7.586', label: 'Love Draw 🎨', badge: 'NEW', badgeClass: 'nav-badge nav-badge-wip' },
    { id: 'air-draw', icon: 'M12 19l7-7 3 3-7 7-3-3z', d: 'M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5zM2 2l7.586 7.586', circle: '11 11 2', label: 'AirDraw AI ✨', badge: 'WIP', badgeClass: 'nav-badge nav-badge-wip' },
    { id: 'surprises', polyline: '20 12 20 22 4 22 4 12', d: 'M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z', icon: 'M2 7h20v5H2z M12 22V7', label: 'Surprises 🎁' },
    { id: 'privacy', icon: 'M7 11V7a5 5 0 0 1 10 0v4', d: 'M3 11h18v11H3z', label: 'Privacy & Lock 🔒' },
  ];

  const bottomItems = [
    { id: 'settings', icon: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z', circle: '12 12 3', label: 'Settings ⚙️' },
    { id: 'help', circle: '12 12 10', d: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3 M12 17h.01', label: 'Help & Support ❓' },
  ];

  const renderNavItem = (item) => (
    <li key={item.id} className="nav-item">
      <NavLink 
        to={`/${item.id}`} 
        className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        end={item.id === ''}
      >
        <span className="nav-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {item.icon && <path d={item.icon} />}
            {item.circle && <circle cx={item.circle.split(' ')[0]} cy={item.circle.split(' ')[1]} r={item.circle.split(' ')[2]} />}
            {item.polyline && <polyline points={item.polyline} />}
            {item.d && <path d={item.d} />}
          </svg>
        </span>
        <span className="nav-label" style={{ display: 'flex', alignItems: 'center', justifyItems: 'flex-start', width: '100%', position: 'relative' }}>
          <span style={{flexGrow: 1}}>{item.label}</span>
          {item.badge && <span className={item.badgeClass || "nav-badge"}>{item.badge}</span>}
        </span>
      </NavLink>
    </li>
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
        <div className="sidebar-logo">
          <div className="logo-icon-wrapper" style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
             <div className="logo-circle" style={{width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
             </div>
             <span className="logo-text" style={{fontWeight: '800', fontSize: '1.5rem', letterSpacing: '-0.5px'}}>PW</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {mainItems.map(renderNavItem)}
          </ul>
          
          <div className="nav-divider"></div>
          
          <ul className="nav-list">
            {secondaryItems.map(renderNavItem)}
          </ul>

          <div className="nav-divider"></div>
          
          <ul className="nav-list nav-bottom">
            {bottomItems.map(renderNavItem)}
            <li className="nav-item nav-item-logout">
              <button className="nav-link" onClick={() => logout()} style={{background:'transparent', border:'none', width:'100%', textAlign:'left', padding:0}}>
                <span className="nav-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                </span>
                <span className="nav-label">Logout 🚪</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}

