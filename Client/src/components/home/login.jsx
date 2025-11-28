import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

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
    <section className={`login-section ${darkMode ? 'dark-mode' : ''}`}>
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-md-offset-3">
            <div className="login-form">
              <div className="form-header">
                <h2>Sign In to IFX Market Ltd.</h2>
                <div className="form-controls">
                  <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                  </select>
                  <button onClick={toggleDarkMode} className="btn btn-sm">
                    {darkMode ? '☀️' : '🌙'}
                  </button>
                </div>
              </div>

              {sessionTimeout && (
                <div className="alert alert-warning">
                  Your session has expired. Please log in again.
                </div>
              )}

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <small className="form-text text-muted">
                    <i className="fa fa-check-circle text-success"></i> Email verified
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <div className="input-group-append">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Remember Me
                    </label>
                  </div>
                </div>


                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                  {loading ? (
                    <>
                      <i className="fa fa-spinner fa-spin"></i> Signing In...
                    </>
                  ) : (
                    <>
                      <i className="fa fa-user"></i> Sign In
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-3">
                <button onClick={handleForgotPassword} className="btn btn-link">
                  Forgot Password?
                </button>
              </div>

              <div className="social-login mt-3">
                <p>Or sign in with:</p>
                <div className="social-buttons">
                  <button onClick={() => handleSocialLogin('Google')} className="btn btn-outline-danger">
                    <i className="fa fa-google"></i> Google
                  </button>
                  <button onClick={() => handleSocialLogin('Apple')} className="btn btn-outline-dark">
                    <i className="fa fa-apple"></i> Apple
                  </button>
                  <button onClick={() => handleSocialLogin('Microsoft')} className="btn btn-outline-primary">
                    <i className="fa fa-windows"></i> Microsoft
                  </button>
                </div>
                <div className="mt-2">
                  <small className="text-muted">
                    Note: Google login requires proper OAuth credentials to be configured in the server.
                  </small>
                </div>
              </div>

              <div className="biometric-login mt-3">
                <button onClick={handleBiometricLogin} className="btn btn-outline-info btn-block">
                  <i className="fa fa-fingerprint"></i> Biometric Login
                </button>
              </div>

              <div className="terms-links mt-3">
                <a href="#" className="text-muted">Terms & Conditions</a> | <a href="#" className="text-muted">Privacy Policy</a>
              </div>

              <p className="text-center mt-3">
                Don't have an account? <Link to="/signup">Register here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;