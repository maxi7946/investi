import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import '../../styles/auth.css';

/**
 * Signup component that displays the signup form for user registration
 */
const Signup = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    subscribeNewsletter: false,
    twoFAEnabled: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (!formData.agreeToTerms) {
      setError('You must agree to the Terms & Conditions');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const result = await register(formData);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailVerification = () => {
    // Simulate email verification
    setEmailVerified(true);
  };

  if (success) {
    return (
      <section className="auth-container">
        <div className="auth-card">
          <div className="auth-visual">
            <div className="brand">
              <h2>Welcome!</h2>
              <p>Registration completed successfully.</p>
            </div>
          </div>
          <div className="auth-form" style={{textAlign:'center'}}>
            <i className="fa fa-check-circle text-success" style={{ fontSize: '4rem' }}></i>
            <h2>Registration Successful!</h2>
            <p>Please check your email to verify your account.</p>
            <p>You will be redirected to the login page shortly.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-container">
      <div className="auth-card">
        <div className="auth-visual">
          <div className="brand">
            <h2>Start your journey</h2>
            <p>Create an account and start investing</p>
          </div>
        </div>
        <div className="auth-form">
          <h3 className="auth-title">Create an Account</h3>
          <div className="auth-sub">Fill in the details to sign up to IFX Market Ltd.</div>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
              <div>
                <label className="form-label" htmlFor="firstName">First Name</label>
                <input id="firstName" name="firstName" className="input-field" value={formData.firstName} onChange={handleChange} required disabled={loading} />
              </div>
              <div>
                <label className="form-label" htmlFor="lastName">Last Name</label>
                <input id="lastName" name="lastName" className="input-field" value={formData.lastName} onChange={handleChange} required disabled={loading} />
              </div>
            </div>

            <div className="form-row">
              <label className="form-label" htmlFor="email">Email Address</label>
              <div style={{display:'flex', gap:8}}>
                <input id="email" name="email" className="input-field" type="email" value={formData.email} onChange={handleChange} required disabled={loading} />
                <button type="button" className="btn-outline" onClick={handleEmailVerification} disabled={loading || !formData.email}>{emailVerified? <i className="fa fa-check text-success"></i>:'Verify'}</button>
              </div>
              {emailVerified && <small className="form-help"> <i className="fa fa-check-circle"></i> Email verified</small>}
            </div>

            <div className="form-row">
              <label className="form-label" htmlFor="phone">Phone</label>
              <input id="phone" name="phone" className="input-field" type="tel" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 123-4567" disabled={loading} />
            </div>

            <div className="form-row">
              <label className="form-label" htmlFor="dateOfBirth">Date of Birth</label>
              <input id="dateOfBirth" name="dateOfBirth" className="input-field" type="date" value={formData.dateOfBirth} onChange={handleChange} disabled={loading} />
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
              <div>
                <label className="form-label" htmlFor="password">Password</label>
                <input id="password" name="password" className="input-field" type="password" value={formData.password} onChange={handleChange} required disabled={loading} minLength={8} />
                <small className="form-help">Minimum 8 characters, include uppercase, lowercase, and numbers</small>
              </div>
              <div>
                <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                <input id="confirmPassword" name="confirmPassword" className="input-field" type="password" value={formData.confirmPassword} onChange={handleChange} required disabled={loading} />
              </div>
            </div>

            <div style={{display:'grid', gap:8, marginTop:12}}>
              <label style={{display:'flex', gap:8, alignItems:'center'}}><input type="checkbox" name="twoFAEnabled" checked={formData.twoFAEnabled} onChange={handleChange} disabled={loading} /> Enable Two-Factor Authentication (Recommended)</label>
              <label style={{display:'flex', gap:8, alignItems:'center'}}><input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} required disabled={loading} /> I agree to the <a href="#" target="_blank" className="link-muted">Terms & Conditions</a> and <a href="#" className="link-muted">Privacy Policy</a></label>
              <label style={{display:'flex', gap:8, alignItems:'center'}}><input type="checkbox" name="subscribeNewsletter" checked={formData.subscribeNewsletter} onChange={handleChange} disabled={loading} /> Subscribe to the newsletter</label>
            </div>

            <div style={{marginTop:14}}>
              <button type="submit" className="btn-fancy" disabled={loading}>{loading ? <><i className="fa fa-spinner fa-spin"></i> Creating Account...</> : <><i className="fa fa-user-plus"></i> Create Account</>}</button>
            </div>
          </form>

          <p style={{textAlign:'center', marginTop:12}}>Already have an account? <Link to="/login" className="link-muted">Sign in here</Link></p>
        </div>
      </div>
    </section>
  );
};

export default Signup;