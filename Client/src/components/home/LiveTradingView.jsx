import React, { useEffect, useRef } from 'react';

/**
 * LiveTradingView component that displays the live trading view section on the home page
 */
const LiveTradingView = () => {
  const iframeRef = useRef(null);
  
  useEffect(() => {
    // Set the iframe attributes
    if (iframeRef.current) {
      iframeRef.current.setAttribute('src', 'https://www.widgets.investing.com/top-cryptocurrencies?theme=darkTheme');
      iframeRef.current.setAttribute('frameborder', '0');
      iframeRef.current.setAttribute('allowtransparency', 'true');
      iframeRef.current.setAttribute('marginwidth', '0');
      iframeRef.current.setAttribute('marginheight', '0');
      iframeRef.current.style.width = '100%';
      iframeRef.current.style.height = '500px';
    }
  }, []);
  
  return (
    <section className="faq">
      <div className="container">
        <div className="row text-center">
          <h2 className="title-head">Live Trading View</h2>
          <div className="title-head-subtitle">
            <p>Powered by Investing.com</p>
          </div>
        </div>
        
        {/* TradingView Widget */}
        <iframe ref={iframeRef} title="Live Trading View"></iframe>
        
        <a 
          className="btn btn-primary sign-in" 
          href="/signup"
          style={{ backgroundColor: '#ff9000' }}
        >
          Start Trading
        </a>
      </div>
    </section>
  );
};

export default LiveTradingView;