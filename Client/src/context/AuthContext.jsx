import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // To handle initial session check
  const navigate = useNavigate();

  useEffect(() => {
    // Check for an active session when the app loads
    const checkSession = async () => {
      try {
        // The cookie is sent automatically by the browser.
        // This endpoint should return user data if the cookie is valid.
        const response = await apiClient.get('/api/user/portfolio'); // Or a dedicated '/auth/me' endpoint

        // A successful response means we have a valid session.
        // We need to get the full user object. Let's assume a /api/auth/me endpoint exists
        // For now, we'll simulate getting the user from another call or assume portfolio has it.
        // A better approach is a dedicated `/api/auth/me` endpoint that returns the user object.
        // Let's assume we have one for this example.
        const userResponse = await apiClient.get('/api/auth/me'); // You would need to create this endpoint

        if (userResponse.data) {
            setUser(userResponse.data);
            setIsAuthenticated(true);
        }

      } catch (error) {
        console.log('No active session found.');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email, password, rememberMe) => {
    try {
      const response = await apiClient.post('/api/auth/login', { email, password, rememberMe });
      const userData = response.data.user;

      setUser(userData);
      setIsAuthenticated(true);

      // No need to handle the token, the browser stores the httpOnly cookie.

      // Navigate to the correct dashboard
      if (userData.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (formData) => {
    try {
      const response = await apiClient.post('/api/auth/register', formData);
      // The backend sends a success message. The user will be redirected to login.
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Registration failed:', error.response?.data?.message || error.message);
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout failed on server:', error);
    } finally {
      // Also clear the user from localStorage if you stored it there for non-auth purposes
      // For example, if you stored user preferences or name for display.
      // Since we are managing user state here, this is the place to clear it.
      // localStorage.removeItem('user'); // Example

      // Clear state and navigate regardless of server outcome
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
    }
  };

  const value = {
    user,
    userRole: user?.role,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};