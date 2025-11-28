import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axios';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('portfolio');
  const [investmentPlans, setInvestmentPlans] = useState([]);
  const [userInvestments, setUserInvestments] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('');
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [portfolioData, setPortfolioData] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Mock data that can be replaced with API calls later
  const [pnlData, setPnlData] = useState([]);
  const [assetAllocation, setAssetAllocation] = useState([]);

  const [watchlist, setWatchlist] = useState([
    { id: 1, name: 'NVIDIA Corp.', ticker: 'NVDA', price: 450.25, change: 8.5 },
    { id: 2, name: 'Alphabet Inc.', ticker: 'GOOGL', price: 2750.00, change: -2.1 },
    { id: 3, name: 'Meta Platforms', ticker: 'META', price: 330.50, change: 3.2 }
  ]);

  const [chartData, setChartData] = useState([]);

  const [timeFilter, setTimeFilter] = useState('1M');
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Your AAPL position is up 7.32%', type: 'success', unread: true },
    { id: 2, message: 'Market opens in 30 minutes', type: 'info', unread: true },
    { id: 3, message: 'New dividend payment received', type: 'success', unread: false }
  ]);

  const [marketNews, setMarketNews] = useState([
    'Tech stocks rally on AI optimism',
    'Federal Reserve signals potential rate cut',
    'Oil prices surge amid supply concerns'
  ]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [plansResponse, walletsResponse] = await Promise.all([
        apiClient.get('/user/plans'),
        apiClient.get('/admin/wallets'), // Assuming users can see admin wallets for depositing
        apiClient.get('/user/portfolio')
      ]);

      setInvestmentPlans(plansResponse.data);
      setWallets(walletsResponse.data.filter(wallet => wallet.isActive));
      setPortfolioData(portfolioResponse.data);
      setHoldings(portfolioResponse.data.holdings || []);
      setTransactions(portfolioResponse.data.transactions || []);

      // Mock chart and allocation data based on portfolio
      if (portfolioResponse.data) {
        const { totalValue, availableCash, investedAmount, transactions } = portfolioResponse.data;
        setAssetAllocation([
          { name: 'Invested', value: investedAmount, color: '#8884d8' },
          { name: 'Cash', value: availableCash, color: '#ffc658' }
        ]);

        // Create some mock chart data from transactions
        const newChartData = transactions.slice(-10).map(t => ({
          date: t.date,
          value: t.total
        })).sort((a, b) => new Date(a.date) - new Date(b.date));
        
        let runningTotal = totalValue;
        const historicalChart = newChartData.map(d => {
          runningTotal -= d.value;
          return { date: d.date, value: runningTotal };
        });
        setChartData(historicalChart);
      }

    } catch (error) {
      console.error('Failed to load investment data:', error);
    }
  };

  const handleInvest = (plan) => {
    setSelectedPlan(plan);
    setShowInvestmentModal(true);
  };

  const submitInvestment = async () => {
    if (!selectedPlan || !investmentAmount || !selectedWallet) {
      alert('Please fill in all fields');
      return;
    }

    const amount = parseFloat(investmentAmount);
    if (amount < selectedPlan.minAmount || amount > selectedPlan.maxAmount) {
      alert(`Investment amount must be between $${selectedPlan.minAmount} and $${selectedPlan.maxAmount}`);
      return;
    }

    try {
      const response = await apiClient.post('/user/invest', {
        planId: selectedPlan.id,
        amount,
        walletId: selectedWallet
      });

      alert('Investment successful!');
      setShowInvestmentModal(false);
      setInvestmentAmount('');
      setSelectedWallet('');
      // Refresh portfolio data
      loadInitialData();
    } catch (error) {
      alert(error.response?.data?.message || 'Investment failed');
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'deposit':
        alert('Deposit functionality would open a modal or redirect to deposit page');
        break;
      case 'withdraw':
        alert('Withdraw functionality would open a modal or redirect to withdraw page');
        break;
      case 'trade':
        alert('Trade functionality would open a modal or redirect to trading page');
        break;
      case 'transfer':
        alert('Transfer functionality would open a modal or redirect to transfer page');
        break;
      default:
        break;
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatPercent = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  if (!portfolioData) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="user-dashboard">
      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <div className="container-fluid">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'portfolio' ? 'active' : ''}`}
                onClick={() => setActiveTab('portfolio')}
              >
                Portfolio
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'investments' ? 'active' : ''}`}
                onClick={() => setActiveTab('investments')}
              >
                Investments
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'plans' ? 'active' : ''}`}
                onClick={() => setActiveTab('plans')}
              >
                Investment Plans
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Header */}
      <div className="dashboard-header">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1>Welcome back, {user?.firstName || 'Investor'}!</h1>
              <p className="text-muted">Here's your portfolio overview</p>
            </div>
            <div className="col-md-6 text-right">
              <div className="header-actions">
                <button className="btn btn-outline-primary mr-2" onClick={() => handleQuickAction('deposit')}>
                  <i className="fa fa-plus"></i> Deposit
                </button>
                <button className="btn btn-outline-success mr-2" onClick={() => handleQuickAction('withdraw')}>
                  <i className="fa fa-minus"></i> Withdraw
                </button>
                <button className="btn btn-primary mr-2" onClick={() => handleQuickAction('trade')}>
                  <i className="fa fa-exchange"></i> Trade
                </button>
                <div className="dropdown">
                  <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown">
                    <i className="fa fa-bell"></i>
                    {notifications.filter(n => n.unread).length > 0 && (
                      <span className="badge badge-danger">{notifications.filter(n => n.unread).length}</span>
                    )}
                  </button>
                  <div className="dropdown-menu">
                    {notifications.map(notification => (
                      <a key={notification.id} className="dropdown-item" href="#">
                        <span className={`text-${notification.type}`}>{notification.message}</span>
                        {notification.unread && <span className="badge badge-primary ml-2">New</span>}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="dropdown ml-2">
                  <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown">
                    <i className="fa fa-user"></i> Profile
                  </button>
                  <div className="dropdown-menu">
                    <a className="dropdown-item" href="#"><i className="fa fa-cog"></i> Settings</a>
                    <a className="dropdown-item" href="#"><i className="fa fa-question-circle"></i> Help</a>
                    <div className="dropdown-divider"></div>
                    <a className="dropdown-item" href="#" onClick={logout}><i className="fa fa-sign-out"></i> Logout</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Overview */}
      {activeTab === 'portfolio' && (
        <div className="portfolio-overview">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Total Portfolio Value</h5>
                  <h3 className="text-primary">{formatCurrency(portfolioData.totalValue || 0)}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Total P&L (Mock)</h5>
                  <h3 className={'text-success'}>{formatCurrency(15000)}</h3>
                  <p className="card-text">Since inception</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Available Cash</h5>
                  <h3 className="text-info">{formatCurrency(portfolioData.availableCash || 0)}</h3>
                  <p className="card-text">Ready to invest</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Invested Amount</h5>
                  <h3 className="text-warning">{formatCurrency(portfolioData.investedAmount || 0)}</h3>
                  <p className="card-text">Total invested</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Charts Section */}
      {activeTab === 'portfolio' && (
      <div className="charts-section">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">
                  <h5>Portfolio Performance</h5>
                  <div className="time-filters">
                    {['1D', '1W', '1M', '3M', '1Y', 'All'].map(filter => (
                      <button
                        key={filter}
                        className={`btn btn-sm ${timeFilter === filter ? 'btn-primary' : 'btn-outline-primary'} mr-1`}
                        onClick={() => setTimeFilter(filter)}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={['dataMin - 1000', 'dataMax + 1000']} />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <h5>Asset Allocation</h5>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={300}>
                    {assetAllocation.length > 0 && <PieChart>
                      <Pie
                        data={assetAllocation}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {assetAllocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>}
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h5>P&L Analysis</h5>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={300}>
                    {pnlData.length > 0 && <BarChart data={pnlData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="profit" fill="#28a745" />
                      <Bar dataKey="loss" fill="#dc3545" />
                    </BarChart>}
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Holdings Table */}
      {activeTab === 'portfolio' && (
      <div className="holdings-section">
        <div className="container-fluid">
          <div className="card">
            <div className="card-header">
              <h5>Your Holdings</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Asset</th>
                      <th>Quantity</th>
                      <th>Current Price</th>
                      <th>Avg. Buy Price</th>
                      <th>Total Value</th>
                      <th>P&L</th>
                      <th>Day Change</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdings.map(holding => (
                      <tr key={holding.ticker}>
                        <td>
                          <div>
                            <strong>{holding.name}</strong>
                            <br />
                            <small className="text-muted">{holding.ticker}</small>
                          </div>
                        </td>
                        <td>{holding.shares}</td>
                        <td>{formatCurrency(holding.marketValue / holding.shares)}</td>
                        <td>{formatCurrency(holding.costBasis / holding.shares)}</td>
                        <td>{formatCurrency(holding.marketValue)}</td>
                        <td className={(holding.marketValue - holding.costBasis) >= 0 ? 'text-success' : 'text-danger'}>
                          {formatCurrency(holding.marketValue - holding.costBasis)}
                        </td>
                        <td className={holding.dayChange >= 0 ? 'text-success' : 'text-danger'}>
                          {formatPercent(holding.dayChange)}
                        </td>
                        <td>
                          <button className="btn btn-sm btn-success mr-1" onClick={() => handleQuickAction('buy')}>
                            Buy More
                          </button>
                          <button className="btn btn-sm btn-danger mr-1" onClick={() => handleQuickAction('sell')}>
                            Sell
                          </button>
                          <button className="btn btn-sm btn-info" onClick={() => alert('Details modal would open')}>
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Bottom Section */}
      {activeTab === 'portfolio' && (
      <div className="bottom-section">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5>Recent Transactions</h5>
                </div>
                <div className="card-body">
                  <div className="transaction-list">
                    {transactions.map(transaction => (
                      <div key={transaction.id} className="transaction-item">
                        <div className="d-flex justify-content-between">
                          <div>
                            <span className={`badge ${transaction.type === 'Buy' ? 'badge-success' : 'badge-danger'}`}>
                              {transaction.type}
                            </span>
                            <strong className="ml-2">{transaction.asset}</strong>
                          </div>
                          <div className={`text-right ${transaction.type === 'Deposit' || transaction.type === 'Buy' ? 'text-success' : 'text-danger'}`}>
                            <div>{transaction.quantity} shares @ {formatCurrency(transaction.price)}</div>
                            <small className="text-muted">{transaction.date}</small>
                          </div>
                        </div>
                        <hr />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5>Watchlist</h5>
                </div>
                <div className="card-body">
                  <div className="watchlist">
                    {watchlist.map(item => (
                      <div key={item.id} className="watchlist-item d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{item.ticker}</strong>
                          <br />
                          <small className="text-muted">{item.name}</small>
                        </div>
                        <div className="text-right">
                          <div>{formatCurrency(item.price)}</div>
                          <small className={item.change >= 0 ? 'text-success' : 'text-danger'}>
                            {formatPercent(item.change)}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Market News Ticker */}
          <div className="row mt-4">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <div className="market-news-ticker">
                    <i className="fa fa-newspaper-o"></i>
                    <marquee>
                      {marketNews.map((news, index) => (
                        <span key={index}>{news} • </span>
                      ))}
                    </marquee>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Investment Plans Tab */}
      {activeTab === 'plans' && (
        <div className="investment-plans-section">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <h5>Available Investment Plans</h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      {investmentPlans.map(plan => (
                        <div key={plan.id} className="col-md-4 mb-4">
                          <div className="card h-100">
                            <div className="card-body">
                              <h5 className="card-title">{plan.name}</h5>
                              <p className="card-text">{plan.description}</p>
                              <div className="mb-3">
                                <strong>Investment Range:</strong><br />
                                ${plan.minAmount.toLocaleString()} - ${plan.maxAmount.toLocaleString()}
                              </div>
                              <div className="mb-3">
                                <strong>Profit:</strong> {plan.profitPercentage}% {plan.profitType === 'daily' ? 'Daily' : 'Monthly'}
                              </div>
                              <div className="mb-3">
                                <strong>Duration:</strong> {plan.duration} Days
                              </div>
                              <button
                                className="btn btn-primary btn-block"
                                onClick={() => handleInvest(plan)}
                              >
                                Invest Now
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Investments Tab */}
      {activeTab === 'investments' && (
        <div className="investments-section">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <h5>Your Investments</h5>
                  </div>
                  <div className="card-body">
                    {userInvestments.length === 0 ? (
                      <p className="text-center text-muted">No active investments yet. Start investing in our plans!</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Plan</th>
                              <th>Amount</th>
                              <th>Start Date</th>
                              <th>End Date</th>
                              <th>Status</th>
                              <th>Expected Profit</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userInvestments.map(investment => (
                              <tr key={investment.id}>
                                <td>{investment.planName}</td>
                                <td>{formatCurrency(investment.amount)}</td>
                                <td>{new Date(investment.startDate).toLocaleDateString()}</td>
                                <td>{new Date(investment.endDate).toLocaleDateString()}</td>
                                <td>
                                  <span className={`badge ${investment.status === 'active' ? 'badge-success' : 'badge-secondary'}`}>
                                    {investment.status}
                                  </span>
                                </td>
                                <td>{formatCurrency(investment.expectedProfit)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Investment Modal */}
      {showInvestmentModal && selectedPlan && (
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
            <h3 style={{ marginBottom: '20px', color: '#fff' }}>Invest in {selectedPlan.name}</h3>
            <div style={{ marginBottom: '20px' }}>
              <div className="form-group">
                <label>Investment Amount ($)</label>
                <input
                  type="number"
                  className="form-control"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  placeholder={`Min: $${selectedPlan.minAmount}, Max: $${selectedPlan.maxAmount}`}
                  min={selectedPlan.minAmount}
                  max={selectedPlan.maxAmount}
                />
              </div>
              <div className="form-group">
                <label>Select Wallet</label>
                <select
                  className="form-control"
                  value={selectedWallet}
                  onChange={(e) => setSelectedWallet(e.target.value)}
                >
                  <option value="">Choose a wallet...</option>
                  {wallets.map(wallet => (
                    <option key={wallet.id} value={wallet.id}>
                      {wallet.name} - Balance: ${wallet.balance.toLocaleString()} {wallet.currency}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginTop: '15px', padding: '15px', background: '#333', borderRadius: '5px' }}>
                <strong>Plan Details:</strong><br />
                Profit: {selectedPlan.profitPercentage}% {selectedPlan.profitType === 'daily' ? 'Daily' : 'Monthly'}<br />
                Duration: {selectedPlan.duration} Days<br />
                Description: {selectedPlan.description}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowInvestmentModal(false)}
                className="btn btn-secondary"
                style={{ background: '#555', border: 'none' }}
              >
                Cancel
              </button>
              <button
                onClick={submitInvestment}
                className="btn btn-primary"
                disabled={!investmentAmount || !selectedWallet}
              >
                Invest Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;