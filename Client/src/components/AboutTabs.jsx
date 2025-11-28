import React, { useState } from 'react';

const AboutTabs = () => {
  const [activeTab, setActiveTab] = useState('menu1');

  return (
    <>
      <ul className="nav nav-tabs">
        <li className={activeTab === 'menu1' ? 'active' : ''}>
          <a data-toggle="tab" href="#menu1" onClick={() => setActiveTab('menu1')}>Our Mission</a>
        </li>
        <li className={activeTab === 'menu2' ? 'active' : ''}>
          <a data-toggle="tab" href="#menu2" onClick={() => setActiveTab('menu2')}>Our advantages</a>
        </li>
      </ul>
      <div className="tab-content">
        <div id="menu1" className={`tab-pane fade${activeTab === 'menu1' ? ' in active' : ''}`}>
          <p>Tab content 1</p>
        </div>
        <div id="menu2" className={`tab-pane fade${activeTab === 'menu2' ? ' in active' : ''}`}>
          <p>Tab content 2</p>
        </div>
      </div>
    </>
  );
};

export default AboutTabs;