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
             <div className="social-icon google">
               <svg viewBox="0 0 24 24" width="24" height="24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/><path fill="none" d="M1 1h22v22H1z"/></svg>
             </div>
             <div className="social-icon github">
               <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
             </div>
             <div className="social-icon facebook">
               <svg viewBox="0 0 24 24" width="24" height="24"><path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
             </div>
          </div>

        </div>
      </div>

      <div className="login-right-panel" style={{ backgroundImage: 'url("./assets/pw_login_hero.png")' }}>
         <div className="hero-overlay">
            <div className="hero-content">
               <h1 className="hero-tagline">Welcome to Your Private World ✨</h1>

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

