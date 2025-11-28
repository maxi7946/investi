import React from 'react';
import Header from './Header.jsx';
import Footer from './footer.jsx';

/**
 * Layout component that wraps the entire application
 * Includes the Header and Footer components
 */
const Layout = ({ children }) => {
  return (
    <div className="wrapper">
      <Header />
      <main>{children}</main>
      <Footer />
      <a href="#" id="back-to-top" className="back-to-top fa fa-arrow-up"></a>
    </div>
  );
};

export default Layout;