import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Auth/Login'; // Will map directly
import Dashboard from './pages/Dashboard';
import Memories from './pages/Memories';
import Chat from './pages/Chat';
import Dates from './pages/Dates';
import Mood from './pages/Mood';
import Settings from './pages/Settings';

import { applyTheme } from './styles/theme';

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  if (loading) return <div>Loading love...</div>;
  if (!currentUser) return <Navigate to="/login" />;
  return children;
}

export default function App() {
  const [theme, setTheme] = useState('romantic');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'romantic';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  return (
    <div className={`app-container theme-${theme}`}>
      <AuthProvider>
        <AppProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><DashboardLayout changeTheme={changeTheme} currentTheme={theme} /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="memories" element={<Memories />} />
                <Route path="love-chat" element={<Chat />} />
                <Route path="special-dates" element={<Dates />} />
                <Route path="mood" element={<Mood />} />
                <Route path="settings" element={<Settings changeTheme={changeTheme} currentTheme={theme} />} />
                
                {/* Fallbacks for unfinished core menus properly structured */}
                <Route path="our-space" element={<div className="card"><h2>Our Space ❤️</h2><p>Coming Soon!</p></div>} />
                <Route path="love-stats" element={<div className="card"><h2>Love Stats ❤️‍🔥</h2><p>Coming Soon!</p></div>} />
                <Route path="airdraw" element={<div className="card"><h2>AirDraw AI ✨</h2><p>Coming Soon!</p></div>} />
                <Route path="surprises" element={<div className="card"><h2>Surprises 🎁</h2><p>Coming Soon!</p></div>} />
                <Route path="privacy" element={<div className="card"><h2>Privacy 🔒</h2><p>Coming Soon!</p></div>} />
                <Route path="help" element={<div className="card"><h2>Help ❓</h2><p>Coming Soon!</p></div>} />
              </Route>
            </Routes>
          </Router>
        </AppProvider>
      </AuthProvider>
    </div>
  );
}
