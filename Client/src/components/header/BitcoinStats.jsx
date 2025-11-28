import React from 'react';
import useScript from '../../hooks/useScript';

/**
 * BitcoinStats component that displays cryptocurrency statistics in the header
 */
const BitcoinStats = () => {
  // Load Bitcoin widget script if needed
  useScript('https://widgets.bitcoin.com/widget.js');
  
  return (
    <div className="col-md-7 col-lg-7">
      <ul className="unstyled bitcoin-stats text-center">
        <li>
          <h6>13,950 USD</h6>
          <span>Last trade price</span>
        </li>
        <li>
          <h6>+2.26%</h6>
          <span>24 hour price</span>
        </li>
        <li>
          <h6>27.390 BTC</h6>
          <span>24 hour volume</span>
        </li>
        <li>
          <h6>1,836,722</h6>
          <span>active traders</span>
        </li>
        <li>
          <div className="btcwdgt-price" data-bw-theme="light" data-bw-cur="usd"></div>
          <span>Live Bitcoin price</span>
        </li>
      </ul>
    </div>
  );
};

export default BitcoinStats;