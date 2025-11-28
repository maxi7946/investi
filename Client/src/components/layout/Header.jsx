import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import Logo from '../header/Logo';
import GoogleTranslate from '../header/GoogleTranslate';
import BitcoinStats from '../header/BitcoinStats';
import UserAuth from '../header/UserAuth';
import TradingViewTicker from '../header/TradingViewTicker';

/**
 * Header component that includes the logo, navigation, and other header elements
 */
const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="row">
          {/* Logo */}
          <Logo />
          
          {/* Google Translate */}
          <div align="center" id="google_translate_element">
            <GoogleTranslate />
          </div>
          
          {/* Bitcoin Stats */}
          <BitcoinStats />
          
          {/* User Authentication */}
          <UserAuth />
        </div>
      </div>
      
      {/* TradingView Widget */}
      <TradingViewTicker />
      
      {/* Navigation */}
      <Navigation />
    </header>
  );
};

export default Header;