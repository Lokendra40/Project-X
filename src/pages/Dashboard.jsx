import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { userData } = useAuth();
  const { loveStats } = useAppContext();

  return (
    <div className="dashboard-grid">
      <div className="dashboard-main">
        <section className="card welcome-card">
          <div className="welcome-content">
            <p className="welcome-tag">Good evening, {userData?.name} 💕</p>
            <h2 className="welcome-title">Welcome back to your world</h2>
            <p className="welcome-quote">"The best thing to hold onto in life is each other."</p>
          </div>
        </section>
        
        <section className="stats-row" style={{ marginTop: '20px' }}>
          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-value">{loveStats.daysTogether}</p>
              <p className="stat-label">Days Together</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-value">{loveStats.totalMemories}</p>
              <p className="stat-label">Total Memories</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-value">{loveStats.messagesSent}</p>
              <p className="stat-label">Messages</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-value">{loveStats.loveScore}%</p>
              <p className="stat-label">Love Score</p>
            </div>
          </div>
        </section>

        <section className="quick-actions" style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
           <Link to="/memories" className="primary-btn">📸 Add Memory</Link>
           <Link to="/chat" className="primary-btn">💬 Send Love Note</Link>
           <Link to="/mood" className="primary-btn">😊 Share Mood</Link>
        </section>
      </div>

      <aside className="dashboard-sidebar">
        <div className="card couple-status-card">
          <p className="couple-label">Your Connection</p>
          <p className="couple-since">Code: {userData?.connectionCode || 'N/A'}</p>
          <div className="couple-mood-row">
            <div className="mood-bubble">
              <span>😊</span>
              <small>Your mood</small>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
