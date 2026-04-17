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
        <div className="card couple-status-card glass-focus" style={{ textAlign: 'center', padding: '30px 20px' }}>
          <p className="couple-label" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.7, marginBottom: '20px' }}>Connection Sync</p>
          
          <div className="pulse-container" style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 20px' }}>
            <div className="pulse-ring" style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid var(--accent)', animation: 'pulseRing 2s infinite' }}></div>
            <div className="pulse-heart" style={{ position: 'absolute', inset: '10px', display: 'grid', placeItems: 'center', fontSize: '2.5rem', animation: 'heartBeat 1.2s infinite' }}>❤️</div>
          </div>
          
          <h3 style={{ margin: '10px 0 5px' }}>98% In Sync</h3>
          <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Both hearts are beating as one today.</p>
          
          <div className="sync-bar" style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '10px', marginTop: '20px', overflow: 'hidden' }}>
            <div style={{ width: '98%', height: '100%', background: 'var(--accent-gradient)', borderRadius: '10px' }}></div>
          </div>
        </div>

        <div className="card" style={{ marginTop: '20px' }}>
           <p className="couple-label">Private Code</p>
           <p className="couple-since" style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--text-accent)' }}>{userData?.connectionCode || 'CP-772-PW'}</p>
        </div>
      </aside>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulseRing {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes heartBeat {
          0% { transform: scale(1); }
          15% { transform: scale(1.15); }
          30% { transform: scale(1); }
          45% { transform: scale(1.15); }
          60% { transform: scale(1); }
        }
      `}} />

    </div>
  );
}
