import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login, signup, guestLogin } = useAuth();
  const navigate = useNavigate();

  const handleGuestLogin = () => {
    guestLogin();
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box card">
        <h1 className="login-title">Private World For Couples 💖</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <input 
              type="text" 
              placeholder="Your Name" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
            />
          )}
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" className="primary-btn">
            {isLogin ? 'Enter Our World 🚪' : 'Create Space 🕊️'}
          </button>
          <button type="button" onClick={handleGuestLogin} className="primary-btn secondary-btn" style={{marginTop: '10px', background: '#f5f5f5', color: '#666'}}>
            View as Guest ✨
          </button>
        </form>
        <p className="login-switch">
          {isLogin ? "Don't have a space? " : "Already have a space? "}
          <button onClick={() => setIsLogin(!isLogin)} className="switch-btn">
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}
