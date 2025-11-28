import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import ScrollToTop from './components/layout/ScrollToTop.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Lazily import page components for code-splitting.
// This creates separate chunks for each page, improving initial load time.
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
// Add more lazy imports for other pages as needed
const Login = lazy(() => import('./components/home/login.jsx'));
const Signup = lazy(() => import('./components/home/signup.jsx'));
const UserDashboard = lazy(() => import('./pages/UserDashboard.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<div className="text-center p-5">Loading...</div>}>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/user-dashboard"
              element={
                <ProtectedRoute requiredRole="user">
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            {/* Add more routes as needed */}
          </Routes>
        </Layout>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;