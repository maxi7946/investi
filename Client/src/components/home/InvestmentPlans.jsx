import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * InvestmentPlans component that displays the investment plans section on the home page
 */
const InvestmentPlans = () => {
  const { isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const plans = [
    {
      id: 1,
      name: 'Bronze Plan',
      minAmount: 500,
      maxAmount: 4999,
      profit: '10% Daily',
      duration: '7 Days',
      description: 'Perfect for beginners starting their investment journey'
    },
    {
      id: 2,
      name: 'Silver Plan',
      minAmount: 5000,
      maxAmount: 9999,
      profit: '15% Daily',
      duration: '15 Days',
      description: 'Great returns for intermediate investors'
    },
    {
      id: 3,
      name: 'Gold Plan',
      minAmount: 10000,
      maxAmount: 14999,
      profit: '20% Daily',
      duration: '21 Days',
      description: 'Premium plan with excellent daily returns'
    },
    {
      id: 4,
      name: 'Platinum Plan',
      minAmount: 15000,
      maxAmount: 19999,
      profit: '30% Monthly',
      duration: '30 Days',
      description: 'High-yield monthly investment plan'
    },
    {
      id: 5,
      name: 'Ultimate Plan',
      minAmount: 20000,
      maxAmount: 50000,
      profit: '40% Monthly',
      duration: '60 Days',
      description: 'Maximum returns for serious investors'
    }
  ];

  const handlePlanSelect = (plan) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const handlePurchase = async () => {
    if (!selectedPlan) return;

    try {
      // Navigate to dashboard or payment page
      navigate('/user-dashboard');
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };
  
  return (
    <section id="plans" className="pricing">
      <div className="container">
        {/* Section Title */}
        <div className="row text-center">
          <h2 className="title-head">Investment <span>Plans</span></h2>
          <div className="title-head-subtitle">
            <p>Complete Packages For Every Trader/Investor</p>
          </div>
        </div>
        
        {/* Section Content */}
        <div className="row pricing-tables-content">
          <div className="pricing-container">
            <ul className="pricing-list bounce-invert">
              {plans.map((plan) => (
                <li key={plan.id} className="col-xs-6 col-sm-6 col-md-4 col-lg-4">
                  <ul className="pricing-wrapper">
                    <li data-type="buy" className="is-visible">
                      <header className="pricing-header">
                        <h2>{plan.name}</h2>
                        <div className="price">
                          <span className="value" style={{ fontSize: '24px' }}>
                            ${plan.minAmount.toLocaleString()} - ${plan.maxAmount.toLocaleString()}
                          </span>
                        </div>
                        <h2>Profit <span><b style={{ color: 'orange' }}>{plan.profit}</b></span></h2>
                        <h2>Duration <span><b style={{ color: 'orange' }}>{plan.duration}</b></span></h2>
                        <p style={{ fontSize: '14px', marginTop: '10px', color: '#ddd' }}>{plan.description}</p>
                      </header>
                      <footer className="pricing-footer">
                        <button
                          onClick={() => handlePlanSelect(plan)}
                          className="btn btn-primary"
                        >
                          {isAuthenticated ? 'Select Plan' : 'Get Started'}
                        </button>
                      </footer>
                    </li>
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Plan Selection Modal */}
      {showModal && selectedPlan && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            background: '#1d1d1d',
            padding: '30px',
            borderRadius: '10px',
            maxWidth: '500px',
            width: '90%',
            color: '#fff'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#fff' }}>Confirm Plan Selection</h3>
            <div style={{ marginBottom: '20px' }}>
              <h4>{selectedPlan.name}</h4>
              <p><strong>Investment Range:</strong> ${selectedPlan.minAmount.toLocaleString()} - ${selectedPlan.maxAmount.toLocaleString()}</p>
              <p><strong>Profit:</strong> {selectedPlan.profit}</p>
              <p><strong>Duration:</strong> {selectedPlan.duration}</p>
              <p style={{ fontSize: '14px', color: '#ddd', marginTop: '10px' }}>{selectedPlan.description}</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-secondary"
                style={{ background: '#555', border: 'none' }}
              >
                Cancel
              </button>
              <button
                onClick={handlePurchase}
                className="btn btn-primary"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default InvestmentPlans;