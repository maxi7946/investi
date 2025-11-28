import React, { useState } from 'react';
import aboutUsImage from '../../assets/images/about-us.png';

/**
 * AboutUs component that displays the about us section on the home page
 */
const AboutUs = () => {
  const [activeTab, setActiveTab] = useState('menu1');
  
  return (
    <section id="aboutus" className="about-us">
      <div className="container">
        {/* Section Title */}
        <div className="row text-center">
          <h2 className="title-head">About <span>Us</span></h2>
          <div className="title-head-subtitle">
            <p>IFX Market Ltd. is an Online Digital trading platform, where companies, individuals and firms are given the opportunity to earn from Crypto trading & forex Exchange, by investing their capital through cryptocurrency, which will
              be used to start up a trading section for you.</p>
          </div>
        </div>
        
        {/* Section Content */}
        <div className="row about-content">
          {/* Image */}
          <div className="col-sm-12 col-md-5 col-lg-6 text-center">
            <img id="about-us" className="img-responsive img-about-us" src={aboutUsImage} alt="about us" />
          </div>
          
          {/* Content */}
          <div className="col-sm-12 col-md-7 col-lg-6">
            <h3 className="title-about">WE ARE IFX Market Ltd.</h3>
            <p className="about-text">
              A special trading system developed by our specialists significantly reduces financial risks, while increasing the efficiency of trading sessions at the same time. IFX Market has its own business model, which allows investors to
              receive high interest rates on a daily basis, regardless of changes in the financial market, which not every company can keep up with.
            </p>
            
            {/* Tabs */}
            <ul className="nav nav-tabs">
              <li className={activeTab === 'menu1' ? 'active' : ''}>
                <a onClick={() => setActiveTab('menu1')}>Our Mission</a>
              </li>
              <li className={activeTab === 'menu2' ? 'active' : ''}>
                <a onClick={() => setActiveTab('menu2')}>Our advantages</a>
              </li>
              <li className={activeTab === 'menu3' ? 'active' : ''}>
                <a onClick={() => setActiveTab('menu3')}>Our guarantees</a>
              </li>
            </ul>
            
            <div className="tab-content">
              <div id="menu1" className={`tab-pane fade ${activeTab === 'menu1' ? 'in active' : ''}`}>
                <p>The platform created by us provides our investors with the most comfortable conditions, in order to help them engage in the investment process. Our professional traders, guided by their own unique trading strategy, will
                  allow our clients to receive such revenue, which even an experienced investor will envy. The whole investment process takes place on terms that are favorable for our investors; everyone will be satisfied with the cooperation
                  with our company. Join us and you will learn how to invest easily and efficiently.</p>
              </div>
              <div id="menu2" className={`tab-pane fade ${activeTab === 'menu2' ? 'in active' : ''}`}>
                <p>Adhering to highest compliance standards <br /> As an international regulated financial intermediary subject to the rules set out by the Swiss self-regulatory organization (SRO – VQF ) Evelo Limited operates under international
                  law and according to AML (Anti-Money Laundering) regulations.</p>
              </div>
              <div id="menu3" className={`tab-pane fade ${activeTab === 'menu3' ? 'in active' : ''}`}>
                <p>We are here because we are passionate about open, transparent markets and aim to be a major driving force in widespread adoption, we are the first and the best in crypto Investments.</p>
              </div>
            </div>
            
            <a className="btn btn-primary" href="/signup">Join us</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;