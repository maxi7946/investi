import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import '../../styles/auth.css';

/**
 * Login component that displays the login form for user authentication
 */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionTimeout, setSessionTimeout] = useState(false);
  const [language, setLanguage] = useState('en');
  const [darkMode, setDarkMode] = useState(false);
  const { login, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Load saved email if remember me was checked
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }

    // Check for session timeout
    const lastActivity = localStorage.getItem('lastActivity');
    if (lastActivity) {
      const timeDiff = Date.now() - parseInt(lastActivity);
      if (timeDiff > 30 * 60 * 1000) { // 30 minutes
        setSessionTimeout(true);
      }
    }

    // Check for OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const role = urlParams.get('role');

    if (token && role) {
      // Handle OAuth login success
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('lastActivity', Date.now().toString());

      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);

      // Navigate based on role
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(email, password, rememberMe);

      if (result.success) {
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        localStorage.setItem('lastActivity', Date.now().toString());

        // Navigate based on user role
        if (userRole === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Implement forgot password flow
    alert('Forgot password functionality would redirect to password recovery page');
  };

  const handleSocialLogin = (provider) => {
    if (provider === 'Google') {
      // Redirect to Google OAuth
      window.location.href = 'http://localhost:3000/auth/google';
    } else {
      // Implement other social logins
      alert(`Social login with ${provider} would be implemented here`);
    }
  };

  const handleBiometricLogin = () => {
    // Implement biometric login
    if ('credentials' in navigator) {
      navigator.credentials.get({ password: true }).then((cred) => {
        // Handle biometric authentication
        alert('Biometric login would be processed here');
      });
    } else {
      alert('Biometric authentication not supported');
    }
  };


  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  }

  return (
    <section className={`auth-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="auth-card">
        <div className="auth-visual">
          <div className="brand">
            <h2>Welcome Back</h2>
            <p>Sign in to manage your portfolio</p>
            <p style={{marginTop:10}}><small className="text-muted">Demo: admin@example.com / admin</small></p>
          </div>
        </div>
        <div className="auth-form">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <h3 className="auth-title">Sign In</h3>
              <div className="auth-sub">Sign in to continue to your investments dashboard.</div>
            </div>
            <div style={{display:'flex', gap:8}}>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="btn-outline">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
              <button onClick={toggleDarkMode} className="btn-outline">{darkMode ? '☀️' : '🌙'}</button>
            </div>
          </div>

          {sessionTimeout && <div className="alert alert-warning">Your session has expired. Please log in again.</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <label className="form-label" htmlFor="email">Email address</label>
              <input id="email" type="email" className="input-field" value={email} onChange={(e)=>setEmail(e.target.value)} required disabled={loading} />
              <small className="form-help"><i className="fa fa-check-circle text-success"></i> Email verified</small>
            </div>

            <div className="form-row">
              <label className="form-label" htmlFor="password">Password</label>
              <div style={{display:'flex', gap:8}}>
                <input id="password" type={showPassword ? 'text' : 'password'} className="input-field" value={password} onChange={(e)=>setPassword(e.target.value)} required disabled={loading} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="btn-outline" aria-label="Toggle password visibility"><i className={`fa ${showPassword? 'fa-eye-slash':'fa-eye'}`}></i></button>
              </div>
            </div>

            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8}}>
              <div style={{display:'flex', alignItems:'center', gap:8}}>
                <input id="rememberMe" type="checkbox" checked={rememberMe} onChange={(e)=>setRememberMe(e.target.checked)} />
                <label htmlFor="rememberMe" style={{color:'var(--muted)'}}>Remember Me</label>
              </div>
              <button type="button" onClick={handleForgotPassword} className="btn-outline">Forgot?</button>
            </div>

            <div style={{marginTop:16}}>
              <button type="submit" className="btn-fancy" disabled={loading}>
                {loading ? <><i className="fa fa-spinner fa-spin"></i> Signing In...</> : <><i className="fa fa-user"></i> Sign In</>}
              </button>
            </div>
          </form>

          <div style={{marginTop:16}}>
            <div className="social-row">
              <button className="social-btn" onClick={()=>handleSocialLogin('Google')}><i className="fa fa-google"></i> Google</button>
              <button className="social-btn" onClick={()=>handleSocialLogin('Apple')}><i className="fa fa-apple"></i> Apple</button>
              <button className="social-btn" onClick={()=>handleSocialLogin('Microsoft')}><i className="fa fa-windows"></i> Microsoft</button>
            </div>
            <div className="auth-footer">Note: Google login requires proper OAuth credentials configured server-side.</div>
          </div>

          <div style={{marginTop:12}}>
            <button onClick={handleBiometricLogin} className="btn-outline" style={{width:'100%'}}><i className="fa fa-fingerprint"></i> Biometric Login</button>
          </div>

          <div style={{marginTop:12}}>
            <a href="#" className="link-muted">Terms & Conditions</a> &nbsp; | &nbsp; <a href="#" className="link-muted">Privacy Policy</a>
          </div>

          <p style={{textAlign:'center', marginTop:12}}>
            Don't have an account? <Link to="/signup" className="link-muted">Create an account</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;