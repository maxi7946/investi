import React from 'react';
import downloadBitcoin from '../../assets/images/icons/orange/download-bitcoin.png';
import addBitcoins from '../../assets/images/icons/orange/add-bitcoins.png';
import buySellBitcoins from '../../assets/images/icons/orange/buy-sell-bitcoins.png';

/**
 * Features component that displays the three feature boxes on the home page
 */
const Features = () => {
  return (
    <section className="features">
      <div className="container">
        <div className="row features-row">
          {/* Feature Box 1 */}
          <div className="feature-box col-md-4 col-sm-12">
            <span className="feature-icon">
              <img id="download-bitcoin" src={downloadBitcoin} alt="download bitcoin" />
            </span>
            <div className="feature-box-content">
              <h3>Open an account</h3>
              <p>Click on the register button to create an account. It's totally easy and free</p>
            </div>
          </div>
          
          {/* Feature Box 2 */}
          <div className="feature-box two col-md-4 col-sm-12">
            <span className="feature-icon">
              <img id="add-bitcoins" src={addBitcoins} alt="add bitcoins" />
            </span>
            <div className="feature-box-content">
              <h3>Deposit/Invest Funds</h3>
              <p>Choose an investment plan and make your first deposit</p>
            </div>
          </div>
          
          {/* Feature Box 3 */}
          <div className="feature-box three col-md-4 col-sm-12">
            <span className="feature-icon">
              <img id="buy-sell-bitcoins" src={buySellBitcoins} alt="buy and sell bitcoins" />
            </span>
            <div className="feature-box-content">
              <h3>Withdraw Funds</h3>
              <p>Request for the withdrawal and receive instant payment</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;