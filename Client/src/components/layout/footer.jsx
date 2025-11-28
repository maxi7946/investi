import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer component that is displayed at the bottom of every page
 */
const Footer = () => {
  return (
    <footer className="footer">
      <div className="top-footer">
        <div className="container">
          <div className="row">
            {/* Partners */}
            <div className="col-sm-4 col-md-2">
              <h4>Our Partners</h4>
              <div className="menu">
                <ul>
                  <li><a target="_blank" rel="noopener noreferrer" href="https://ifxbrokers.com/">IFX Brokers</a></li>
                  <li><a target="_blank" rel="noopener noreferrer" href="https://www.ifxpayments.com/">IFX Payments</a></li>
                  <li><a target="_blank" rel="noopener noreferrer" href="http://www.ifxforum.org">IFX Forum Inc.</a></li>
                </ul>
              </div>
            </div>

            {/* Help & Support */}
            <div className="col-sm-4 col-md-2">
              <h4>Help & Support</h4>
              <div className="menu">
                <ul>
                  <li><Link to="/#faq">Help</Link></li>
                  <li><Link to="/#contact">Contact Us</Link></li>
                  <li><a href="/signup">Register</a></li>
                  <li><a href="/login">Login</a></li>
                </ul>
              </div>
            </div>

            {/* Contact Us */}
            <div className="col-sm-4 col-md-3">
              <h4>Contact Us</h4>
              <div className="contacts">
                <div>
                  <span>info@ifxmarket.online</span>
                </div>
                <div>
                  <span>+44 59 524 2099</span>
                </div>
                <div>
                  <span><i className="fa fa-map-marker uk-margin-small-right"></i> Park House, 16 Finsbury Circus, London, EC2M 7EB</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="col-sm-12 col-md-5">
              <div className="facts-footer">
                <div>
                  <h5>$198.76B</h5>
                  <span>Market cap</span>
                </div>
                <div>
                  <h5>243K</h5>
                  <span>daily transactions</span>
                </div>
                <div>
                  <h5>369K</h5>
                  <span>active accounts</span>
                </div>
                <div>
                  <h5>129</h5>
                  <span>supported countries</span>
                </div>
              </div>
              <hr />
            </div>
          </div>
        </div>
      </div>
      <div className="bottom-footer">
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <p className="text-center">Copyright © {new Date().getFullYear()} IFX Market Ltd. <br /> All Rights Reserved</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;