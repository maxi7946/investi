import React from 'react';

/**
 * CallToAction component that displays the call-to-action section on the home page
 */
const CallToAction = () => {
  return (
    <section className="call-action-all">
      <div className="call-action-all-overlay">
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              {/* Call To Action Text */}
              <div className="action-text">
                <h2>Get Started Today With IFX Market Ltd.</h2>
                <p className="lead">Open account for free to start investing and mining in Crypto!</p>
              </div>
              
              {/* Call To Action Button */}
              <p className="action-btn">
                <a className="btn btn-primary" href="/signup">Register Now</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;