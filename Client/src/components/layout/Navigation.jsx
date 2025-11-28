import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import mobileLogo from '../../assets/logo/ifxmarket-white.png';

/**
 * Navigation component that handles the site navigation menu
 */
const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isAuthenticated, userRole, logout } = useAuth();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };
  
  return (
    <nav className="site-navigation navigation" id="site-navigation">
      <div className="container">
        <div className="site-nav-inner">
          {/* Mobile Logo */}
          <Link className="logo-mobile" to="/">
            <img id="logo-mobile" className="img-responsive" src={mobileLogo} alt="logo" />
          </Link>
          
          {/* Mobile Toggle Button */}
          <button 
            type="button" 
            className="navbar-toggle" 
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          
          {/* Navigation Menu */}
          <div className={`collapse navbar-collapse navbar-responsive-collapse ${isMenuOpen ? 'in' : ''}`}>
            <ul className="nav navbar-nav">
              <li className="active">
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/aboutus">About Us</Link>
              </li>
              <li>
                <Link to="/features">Features</Link>
              </li>
              <li>
                <Link to="/plans">Investment Plans</Link>
              </li>
              {isAuthenticated ? (
                <li>
                  <button onClick={logout} className="btn btn-link nav-link">
                    Logout
                  </button>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/login">login</Link>
                  </li>
                  <li>
                    <Link to="/signup">register</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Search Input */}
      <div className={`site-search ${isSearchOpen ? 'visible' : ''}`}>
        <div className="container">
          <input type="text" placeholder="type your keyword and hit enter ..." />
          <span className="close" onClick={toggleSearch}>×</span>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;