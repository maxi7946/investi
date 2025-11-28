import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo/logo.png';

/**
 * Logo component for the header
 */
const Logo = () => {
  return (
    <div className="main-logo col-xs-12 col-md-3 col-md-2 col-lg-2 hidden-xs">
      <Link to="/">
        <img id="logo" width="100px" src={logo} alt="logo" />
      </Link>
    </div>
  );
};

export default Logo;