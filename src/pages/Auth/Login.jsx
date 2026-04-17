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
    <div className="arcana-login-page">
      <div className="login-left-panel">
        <div className="login-form-wrapper slide-up">
          <div className="brand-header">
             <div className="mini-logo">PW</div>
             <span className="brand-name">Private World</span>
          </div>

          <h2 className="signin-title">{isLogin ? 'Sign in' : 'Create Account'}</h2>
          
          {error && <div className="error-badge">{error}</div>}

          <form onSubmit={handleSubmit} className="premium-form">
            {!isLogin && (
              <div className="input-group">
                <label>Full Name</label>
                <div className="input-with-icon">
                  <span className="icon">👤</span>
                  <input type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required />
                </div>
              </div>
            )}

            <div className="input-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <span className="icon">✉️</span>
                <input type="email" placeholder="johndoe@gmail.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-with-icon">
                <span className="icon">🔒</span>
                <input type="password" placeholder="••••••" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
            </div>

            <div className="form-options">
               <label className="checkbox-label">
                 <input type="checkbox" /> <span>Remember me</span>
               </label>
               {isLogin && <button type="button" className="forgot-link">Forgot Password?</button>}
            </div>

            <button type="submit" className="arcana-submit-btn">
              {isLogin ? 'Sign in' : 'Start Journey'}
            </button>

            <button type="button" onClick={handleGuestLogin} className="guest-pill-btn">
              Explore as Guest ✨
            </button>
          </form>

          <p className="auth-footer">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="switch-text-btn">
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          <div className="social-login-row">
             <div className="social-icon google">G</div>
             <div className="social-icon github">H</div>
             <div className="social-icon facebook">F</div>
          </div>
        </div>
      </div>

      <div className="login-right-panel" style={{ backgroundImage: 'url("/assets/pw_login_hero.png")' }}>
         <div className="hero-overlay">
            <div className="hero-content">
               <h1 className="hero-tagline">Welcome to Your Private World</h1>
               <p className="hero-desc">The most intimate space for couples to build, store, and relive their joint history through AI and memories.</p>
               
               <div className="feature-card">
                  <h3>Build your right life together</h3>
                  <p>Be among the first couples to experience the easiest way to store your joint digital life.</p>
                  <div className="user-avatars">
                     <div className="avatar">👩‍❤️‍👨</div>
                     <div className="avatar-plus">+2k</div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .arcana-login-page {
          display: flex;
          height: 100vh;
          width: 100vw;
          background: #fff;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }

        .login-left-panel {
          flex: 0 0 45%;
          display: grid;
          place-items: center;
          padding: 40px;
        }

        .login-right-panel {
          flex: 1;
          background-size: cover;
          background-position: center;
          position: relative;
          margin: 15px;
          border-radius: 30px;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
          border-radius: 30px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 60px;
          color: white;
        }

        .hero-content {
          max-width: 500px;
        }

        .hero-tagline { font-size: 2.8rem; margin-bottom: 20px; font-weight: 700; }
        .hero-desc { opacity: 0.8; font-size: 1.1rem; line-height: 1.6; margin-bottom: 40px; }

        .feature-card {
           background: rgba(255,255,255,0.1);
           backdrop-filter: blur(20px);
           padding: 30px;
           border-radius: 20px;
           border: 1px solid rgba(255,255,255,0.1);
        }

        .login-form-wrapper {
          width: 100%;
          max-width: 400px;
        }

        .brand-header { display: flex; align-items: center; gap: 12px; margin-bottom: 40px; }
        .mini-logo { width: 35px; height: 35px; background: #000; color: #fff; display: grid; place-items: center; border-radius: 8px; font-weight: bold; }
        .brand-name { font-weight: 700; font-size: 1.2rem; }

        .signin-title { font-size: 2.5rem; margin-bottom: 30px; }

        .input-group { margin-bottom: 20px; }
        .input-group label { display: block; font-size: 0.9rem; margin-bottom: 8px; font-weight: 600; color: #333; }
        .input-with-icon { position: relative; }
        .input-with-icon .icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); opacity: 0.5; }
        .input-with-icon input { width: 100%; padding: 14px 15px 14px 45px; border: 1px solid #eee; border-radius: 12px; outline: none; transition: 0.3s; }
        .input-with-icon input:focus { border-color: #000; box-shadow: 0 0 0 4px rgba(0,0,0,0.05); }

        .form-options { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; font-size: 0.85rem; }
        .checkbox-label { display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .forgot-link { font-weight: 600; font-size: 0.85rem; color: #666; }

        .arcana-submit-btn { width: 100%; padding: 15px; background: #000; color: #fff; border-radius: 12px; font-weight: 600; margin-bottom: 15px; font-size: 1rem; transition: 0.3s; }
        .arcana-submit-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }

        .guest-pill-btn { width: 100%; padding: 12px; border: 1px solid #eee; border-radius: 30px; font-size: 0.9rem; color: #666; margin-bottom: 30px; }

        .auth-footer { text-align: center; font-size: 0.9rem; color: #666; }
        .switch-text-btn { font-weight: 700; color: #000; margin-left: 5px; }

        .social-login-row { display: flex; justify-content: center; gap: 20px; margin-top: 40px; }
        .social-icon { width: 50px; height: 50px; border: 1px solid #eee; border-radius: 50%; display: grid; place-items: center; font-weight: 900; color: #333; cursor: pointer; transition: 0.3s; }
        .social-icon:hover { background: #f9f9f9; transform: scale(1.1); }

        .user-avatars { display: flex; align-items: center; gap: 5px; margin-top: 15px; }
        .avatar { width: 30px; height: 30px; border-radius: 50%; background: #eee; display: grid; place-items: center; border: 2px solid #fff; }
        .avatar-plus { font-size: 0.75rem; font-weight: bold; opacity: 0.7; }
      `}} />
    </div>
  );
}

