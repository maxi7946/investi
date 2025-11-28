import React, { useState } from 'react';

/**
 * FAQ component that displays the FAQ section on the home page
 */
const FAQ = () => {
  const [activeItem, setActiveItem] = useState('collapse1');
  
  const faqItems = [
    {
      id: 'collapse1',
      question: 'How do i get started?',
      answer: 'Create your own account to get started. It takes a few minutes to complete registration.'
    },
    {
      id: 'collapse2',
      question: 'Is IFX Market Ltd. financial investment platform availability for the public?',
      answer: 'Yes, IFX Market Ltd. is available to both individuals, companies and cooperate organization, Who are interested in earning.'
    },
    {
      id: 'collapse6',
      question: 'Is there any limitation to my withdrawal?',
      answer: 'No Limitation to Withdrawals.'
    },
    {
      id: 'collapse7',
      question: 'What is the minimum deposit?',
      answer: 'Minimum deposit here is $50.'
    },
    {
      id: 'collapse3',
      question: 'Are there any Commissions upon making transaction on my account?',
      answer: 'IFX Market Ltd. does not take any commissions on your transactions. But such commissions can be taken by the payment systems or payment aggregator.'
    },
    {
      id: 'collapse8',
      question: 'What happens when I deposit any other amount than I requested?.',
      answer: 'The Deposit will be Voided. Make sure you send the exact amount as you requested.'
    },
    {
      id: 'collapse4',
      question: 'How can I Close my Account?',
      answer: 'In case you wish to stop using your account, please contact our Customer Support Department via email'
    },
    {
      id: 'collapse5',
      question: 'Must I Submit My ID for KYC Verification??',
      answer: 'Yes, You must submit your ID for KYC verification.'
    }
  ];
  
  const toggleItem = (id) => {
    setActiveItem(activeItem === id ? null : id);
  };
  
  return (
    <section id="faq" className="faq">
      <div className="container">
        <div className="row text-center">
          <h2 className="title-head">FAQs</h2>
          <div className="title-head-subtitle">
            <p>Frequently Asked Questions</p>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-md-12">
            {/* Panel Group */}
            <div className="panel-group" id="accordion">
              {faqItems.map((item) => (
                <div key={item.id} className="panel panel-default">
                  {/* Panel Heading */}
                  <div className="panel-heading">
                    <h4 className="panel-title">
                      <a 
                        className={activeItem !== item.id ? 'collapsed' : ''}
                        onClick={() => toggleItem(item.id)}
                      >
                        {item.question}
                      </a>
                    </h4>
                  </div>
                  
                  {/* Panel Content */}
                  <div 
                    id={item.id} 
                    className={`panel-collapse collapse ${activeItem === item.id ? 'in' : ''}`}
                  >
                    <div className="panel-body">{item.answer}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;