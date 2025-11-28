import React from 'react';
import strongSecurity from '../../assets/images/icons/orange/strong-security.png';
import worldCoverage from '../../assets/images/icons/orange/world-coverage.png';
import paymentOptions from '../../assets/images/icons/orange/payment-options.png';
import mobileApp from '../../assets/images/icons/orange/mobile-app.png';

/**
 * WhyChooseUs component that displays the "Why Choose Us?" section on the home page
 */
const WhyChooseUs = () => {
  return (
    <section id="features" className="image-block">
      <div className="container-fluid">
        <div className="row">
          {/* Features */}
          <div className="col-md-8 ts-padding img-block-left">
            <div className="gap-20"></div>
            <div className="row text-center">
              <h2 className="title-head">Why Choose Us?</h2>
              <div className="title-head-subtitle">
                <p>We are a worldwide investment company committed to the principle of revenue maximization and reduction of the financial risks in investing.</p>
              </div>
            </div>
            <div className="row">
              {/* Feature 1 */}
              <div className="col-sm-6 col-md-6 col-xs-12">
                <div className="feature text-center">
                  <span className="feature-icon">
                    <img id="strong-security" src={strongSecurity} alt="strong security" />
                  </span>
                  <h3 className="feature-title">Instant Withdrawals</h3>
                  <p>Get your payment instantly through requesting it! We don't take percentage.</p>
                </div>
              </div>
              
              <div className="gap-20-mobile"></div>
              
              {/* Feature 2 */}
              <div className="col-sm-6 col-md-6 col-xs-12">
                <div className="feature text-center">
                  <span className="feature-icon">
                    <img id="world-coverage" src={worldCoverage} alt="world coverage" />
                  </span>
                  <h3 className="feature-title">Referral System</h3>
                  <p>Promote the company and earn unlimited referral commission from each referral.</p>
                </div>
              </div>
            </div>
            
            <div className="gap-20"></div>
            
            <div className="row">
              {/* Feature 3 */}
              <div className="col-sm-6 col-md-6 col-xs-12">
                <div className="feature text-center">
                  <span className="feature-icon">
                    <img id="payment-options" src={paymentOptions} alt="payment options" />
                  </span>
                  <h3 className="feature-title">Blockchain Ecosystem</h3>
                  <p>Get mining with a big profit, and Miner is calculated with the blockchain ecosystem.</p>
                </div>
              </div>
              
              <div className="gap-20-mobile"></div>
              
              {/* Feature 4 */}
              <div className="col-sm-6 col-md-6 col-xs-12">
                <div className="feature text-center">
                  <span className="feature-icon">
                    <img id="mobile-app" src={mobileApp} alt="mobile app" />
                  </span>
                  <h3 className="feature-title">Profitable Plans</h3>
                  <p>Our investment plans are tailored to the level of your investment opportunities.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Video/Image */}
          <div className="col-md-4 ts-padding bg-image-1"></div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;