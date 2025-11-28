import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area } from 'recharts';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [platformMetrics, setPlatformMetrics] = useState({
    totalUsers: 15420,
    activeUsers24h: 3240,
    totalAUM: 250000000,
    platformRevenue: 1250000,
    totalPnL: 8750000
  });

  const [userGrowthData, setUserGrowthData] = useState([
    { month: 'Jan', users: 12000 },
    { month: 'Feb', users: 12800 },
    { month: 'Mar', users: 13500 },
    { month: 'Apr', users: 14200 },
    { month: 'May', users: 14800 },
    { month: 'Jun', users: 15420 }
  ]);

  const [revenueData, setRevenueData] = useState([
    { month: 'Jan', revenue: 950000 },
    { month: 'Feb', revenue: 1020000 },
    { month: 'Mar', revenue: 1080000 },
    { month: 'Apr', revenue: 1150000 },
    { month: 'May', revenue: 1200000 },
    { month: 'Jun', revenue: 1250000 }
  ]);

  const [aumData, setAumData] = useState([
    { month: 'Jan', aum: 200000000 },
    { month: 'Feb', aum: 210000000 },
    { month: 'Mar', aum: 220000000 },
    { month: 'Apr', aum: 230000000 },
    { month: 'May', aum: 240000000 },
    { month: 'Jun', aum: 250000000 }
  ]);

  const [pnlDistribution, setPnlDistribution] = useState([
    { name: 'Profitable', value: 68, color: '#28a745' },
    { name: 'Loss-making', value: 32, color: '#dc3545' }
  ]);

  const [transactionVolume, setTransactionVolume] = useState([
    { day: 'Mon', volume: 1250000 },
    { day: 'Tue', volume: 1450000 },
    { day: 'Wed', volume: 1320000 },
    { day: 'Thu', volume: 1580000 },
    { day: 'Fri', volume: 1750000 },
    { day: 'Sat', volume: 850000 },
    { day: 'Sun', volume: 650000 }
  ]);

  const [assetPopularity, setAssetPopularity] = useState([
    { asset: 'AAPL', trades: 4500, volume: 12500000 },
    { asset: 'MSFT', trades: 3800, volume: 9800000 },
    { asset: 'TSLA', trades: 3200, volume: 15200000 },
    { asset: 'AMZN', trades: 2900, volume: 8900000 },
    { asset: 'GOOGL', trades: 2600, volume: 7200000 }
  ]);

  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', registrationDate: '2024-01-15', portfolioValue: 50000, pnl: 2500, pnlPercent: 5.25 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Active', registrationDate: '2024-02-20', portfolioValue: 75000, pnl: -1200, pnlPercent: -1.58 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Suspended', registrationDate: '2024-03-10', portfolioValue: 25000, pnl: 800, pnlPercent: 3.31 },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', status: 'Pending', registrationDate: '2024-06-01', portfolioValue: 0, pnl: 0, pnlPercent: 0 }
  ]);

  const [transactions, setTransactions] = useState([
    { id: 1, user: 'John Doe', type: 'Buy', asset: 'AAPL', amount: 5000, status: 'Completed', timestamp: '2024-06-15 14:30' },
    { id: 2, user: 'Jane Smith', type: 'Sell', asset: 'TSLA', amount: 7500, status: 'Pending', timestamp: '2024-06-15 13:45' },
    { id: 3, user: 'Bob Johnson', type: 'Deposit', asset: 'USD', amount: 10000, status: 'Completed', timestamp: '2024-06-15 12:20' },
    { id: 4, user: 'Alice Brown', type: 'Withdraw', asset: 'USD', amount: 2500, status: 'Flagged', timestamp: '2024-06-15 11:15' }
  ]);

  const [withdrawals, setWithdrawals] = useState([
    { id: 1, user: 'John Doe', amount: 5000, status: 'Pending', requestedAt: '2024-06-14', method: 'Bank Transfer' },
    { id: 2, user: 'Jane Smith', amount: 2500, status: 'Approved', requestedAt: '2024-06-13', method: 'Wire Transfer' },
    { id: 3, user: 'Bob Johnson', amount: 10000, status: 'Rejected', requestedAt: '2024-06-12', method: 'ACH' }
  ]);

  const [settings, setSettings] = useState({
    tradingFees: 0.25,
    marketHours: { open: '09:30', close: '16:00' },
    minDeposit: 100,
    maxWithdrawal: 50000,
    twoFAEnforced: true,
    maintenanceMode: false
  });

  const [supportTickets, setSupportTickets] = useState([
    { id: 1, user: 'John Doe', subject: 'Login Issue', status: 'Open', priority: 'High', createdAt: '2024-06-15' },
    { id: 2, user: 'Jane Smith', subject: 'Transaction Error', status: 'In Progress', priority: 'Medium', createdAt: '2024-06-14' },
    { id: 3, user: 'Bob Johnson', subject: 'Account Verification', status: 'Closed', priority: 'Low', createdAt: '2024-06-13' }
  ]);

  const [systemHealth, setSystemHealth] = useState({
    serverStatus: 'Online',
    databaseStatus: 'Healthy',
    apiResponseTime: 245,
    uptime: '99.9%',
    activeConnections: 1250
  });

  const [activityLogs, setActivityLogs] = useState([
    { id: 1, timestamp: '2024-06-15 14:30:25', user: 'John Doe', action: 'Login', ip: '192.168.1.1' },
    { id: 2, timestamp: '2024-06-15 14:25:10', user: 'Jane Smith', action: 'Trade Executed', ip: '192.168.1.2' },
    { id: 3, timestamp: '2024-06-15 14:20:45', user: 'System', action: 'Backup Completed', ip: 'localhost' }
  ]);

  const [userSearch, setUserSearch] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('All');

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatPercent = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                         user.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesStatus = userStatusFilter === 'All' || user.status === userStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUserAction = (userId, action) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, status: action } : user
    ));
  };

  const handleSettingsChange = (setting, value) => {
    setSettings({ ...settings, [setting]: value });
  };

  const handleExportReport = (type) => {
    alert(`${type} report export functionality would be implemented`);
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header bg-primary text-white">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1>Admin Dashboard</h1>
              <p>Platform management and analytics</p>
            </div>
            <div className="col-md-6 text-right">
              <button className="btn btn-light mr-2" onClick={() => handleExportReport('Compliance')}>
                <i className="fa fa-download"></i> Export Reports
              </button>
              <button className="btn btn-outline-light mr-2" onClick={() => alert('Settings modal would open')}>
                <i className="fa fa-cog"></i> Settings
              </button>
              <button className="btn btn-outline-light" onClick={logout}>
                <i className="fa fa-sign-out"></i> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Overview Metrics */}
      <div className="metrics-section">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2">
              <div className="card text-center">
                <div className="card-body">
                  <h3 className="text-primary">{platformMetrics.totalUsers.toLocaleString()}</h3>
                  <p className="card-text">Total Users</p>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card text-center">
                <div className="card-body">
                  <h3 className="text-success">{platformMetrics.activeUsers24h.toLocaleString()}</h3>
                  <p className="card-text">Active Users (24h)</p>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card text-center">
                <div className="card-body">
                  <h3 className="text-info">{formatCurrency(platformMetrics.totalAUM)}</h3>
                  <p className="card-text">Total AUM</p>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card text-center">
                <div className="card-body">
                  <h3 className="text-warning">{formatCurrency(platformMetrics.platformRevenue)}</h3>
                  <p className="card-text">Platform Revenue</p>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card text-center">
                <div className="card-body">
                  <h3 className={platformMetrics.totalPnL >= 0 ? 'text-success' : 'text-danger'}>
                    {formatCurrency(platformMetrics.totalPnL)}
                  </h3>
                  <p className="card-text">Total P&L</p>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card text-center">
                <div className="card-body">
                  <div className={`status-indicator ${systemHealth.serverStatus === 'Online' ? 'online' : 'offline'}`}></div>
                  <h5>{systemHealth.serverStatus}</h5>
                  <p className="card-text">System Status</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5>User Growth</h5>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="users" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5>Revenue Trend</h5>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Line type="monotone" dataKey="revenue" stroke="#28a745" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <h5>AUM Growth</h5>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={aumData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Line type="monotone" dataKey="aum" stroke="#17a2b8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <h5>P&L Distribution</h5>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={pnlDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pnlDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <h5>Transaction Volume</h5>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={transactionVolume}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Bar dataKey="volume" fill="#ffc107" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="user-management-section">
        <div className="container-fluid">
          <div className="card">
            <div className="card-header">
              <h5>User Management</h5>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <input
                    type="text"
                    className="form-control mr-2"
                    placeholder="Search users..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    style={{ display: 'inline-block', width: '200px' }}
                  />
                  <select
                    className="form-control"
                    value={userStatusFilter}
                    onChange={(e) => setUserStatusFilter(e.target.value)}
                    style={{ display: 'inline-block', width: '150px', marginLeft: '10px' }}
                  >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Registration Date</th>
                      <th>Portfolio Value</th>
                      <th>P&L</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge ${
                            user.status === 'Active' ? 'badge-success' :
                            user.status === 'Suspended' ? 'badge-warning' :
                            'badge-secondary'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td>{user.registrationDate}</td>
                        <td>{formatCurrency(user.portfolioValue)}</td>
                        <td className={user.pnl >= 0 ? 'text-success' : 'text-danger'}>
                          {formatCurrency(user.pnl)} ({formatPercent(user.pnlPercent)})
                        </td>
                        <td>
                          <button className="btn btn-sm btn-info mr-1" onClick={() => alert('View details modal would open')}>
                            View
                          </button>
                          {user.status === 'Active' && (
                            <button className="btn btn-sm btn-warning mr-1" onClick={() => handleUserAction(user.id, 'Suspended')}>
                              Suspend
                            </button>
                          )}
                          {user.status === 'Suspended' && (
                            <button className="btn btn-sm btn-success mr-1" onClick={() => handleUserAction(user.id, 'Active')}>
                              Activate
                            </button>
                          )}
                          <button className="btn btn-sm btn-primary" onClick={() => alert('Message modal would open')}>
                            Message
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

      {/* Transaction Monitoring */}
      <div className="transaction-monitoring-section">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">
                  <h5>Transaction Monitoring</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Type</th>
                          <th>Asset</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map(transaction => (
                          <tr key={transaction.id}>
                            <td>{transaction.user}</td>
                            <td>
                              <span className={`badge ${
                                transaction.type === 'Buy' ? 'badge-success' :
                                transaction.type === 'Sell' ? 'badge-danger' :
                                transaction.type === 'Deposit' ? 'badge-info' :
                                'badge-warning'
                              }`}>
                                {transaction.type}
                              </span>
                            </td>
                            <td>{transaction.asset}</td>
                            <td>{formatCurrency(transaction.amount)}</td>
                            <td>
                              <span className={`badge ${
                                transaction.status === 'Completed' ? 'badge-success' :
                                transaction.status === 'Pending' ? 'badge-warning' :
                                transaction.status === 'Flagged' ? 'badge-danger' :
                                'badge-secondary'
                              }`}>
                                {transaction.status}
                              </span>
                            </td>
                            <td>{transaction.timestamp}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <h5>Pending Withdrawals</h5>
                </div>
                <div className="card-body">
                  {withdrawals.map(withdrawal => (
                    <div key={withdrawal.id} className="withdrawal-item mb-3 p-2 border rounded">
                      <div className="d-flex justify-content-between">
                        <strong>{withdrawal.user}</strong>
                        <span className={`badge ${
                          withdrawal.status === 'Approved' ? 'badge-success' :
                          withdrawal.status === 'Pending' ? 'badge-warning' :
                          'badge-danger'
                        }`}>
                          {withdrawal.status}
                        </span>
                      </div>
                      <div className="mt-1">
                        <small>Amount: {formatCurrency(withdrawal.amount)}</small><br />
                        <small>Method: {withdrawal.method}</small><br />
                        <small>Requested: {withdrawal.requestedAt}</small>
                      </div>
                      {withdrawal.status === 'Pending' && (
                        <div className="mt-2">
                          <button className="btn btn-sm btn-success mr-1" onClick={() => alert('Approve withdrawal')}>
                            Approve
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => alert('Reject withdrawal')}>
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Settings */}
      <div className="platform-settings-section">
        <div className="container-fluid">
          <div className="card">
            <div className="card-header">
              <h5>Platform Settings</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Trading Fees (%)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={settings.tradingFees}
                      onChange={(e) => handleSettingsChange('tradingFees', parseFloat(e.target.value))}
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label>Market Hours</label>
                    <div className="row">
                      <div className="col-6">
                        <input
                          type="time"
                          className="form-control"
                          value={settings.marketHours.open}
                          onChange={(e) => handleSettingsChange('marketHours', { ...settings.marketHours, open: e.target.value })}
                        />
                        <small>Open</small>
                      </div>
                      <div className="col-6">
                        <input
                          type="time"
                          className="form-control"
                          value={settings.marketHours.close}
                          onChange={(e) => handleSettingsChange('marketHours', { ...settings.marketHours, close: e.target.value })}
                        />
                        <small>Close</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Minimum Deposit ($)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={settings.minDeposit}
                      onChange={(e) => handleSettingsChange('minDeposit', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Maximum Withdrawal ($)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={settings.maxWithdrawal}
                      onChange={(e) => handleSettingsChange('maxWithdrawal', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="twoFAEnforced"
                      checked={settings.twoFAEnforced}
                      onChange={(e) => handleSettingsChange('twoFAEnforced', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="twoFAEnforced">
                      Enforce 2FA for all users
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="maintenanceMode"
                      checked={settings.maintenanceMode}
                      onChange={(e) => handleSettingsChange('maintenanceMode', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="maintenanceMode">
                      Maintenance Mode
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support and System Health */}
      <div className="support-system-section">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5>Support Tickets</h5>
                </div>
                <div className="card-body">
                  <div className="support-tickets">
                    {supportTickets.map(ticket => (
                      <div key={ticket.id} className="ticket-item mb-3 p-2 border rounded">
                        <div className="d-flex justify-content-between">
                          <strong>{ticket.subject}</strong>
                          <span className={`badge ${
                            ticket.priority === 'High' ? 'badge-danger' :
                            ticket.priority === 'Medium' ? 'badge-warning' :
                            'badge-success'
                          }`}>
                            {ticket.priority}
                          </span>
                        </div>
                        <div className="mt-1">
                          <small>User: {ticket.user}</small><br />
                          <small>Status: <span className={`badge ${
                            ticket.status === 'Open' ? 'badge-danger' :
                            ticket.status === 'In Progress' ? 'badge-warning' :
                            'badge-success'
                          }`}>{ticket.status}</span></small><br />
                          <small>Created: {ticket.createdAt}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5>System Health</h5>
                </div>
                <div className="card-body">
                  <div className="system-health">
                    <div className="health-item mb-3">
                      <div className="d-flex justify-content-between">
                        <span>Server Status</span>
                        <span className={`badge ${systemHealth.serverStatus === 'Online' ? 'badge-success' : 'badge-danger'}`}>
                          {systemHealth.serverStatus}
                        </span>
                      </div>
                    </div>
                    <div className="health-item mb-3">
                      <div className="d-flex justify-content-between">
                        <span>Database Status</span>
                        <span className={`badge ${systemHealth.databaseStatus === 'Healthy' ? 'badge-success' : 'badge-danger'}`}>
                          {systemHealth.databaseStatus}
                        </span>
                      </div>
                    </div>
                    <div className="health-item mb-3">
                      <div className="d-flex justify-content-between">
                        <span>API Response Time</span>
                        <span>{systemHealth.apiResponseTime}ms</span>
                      </div>
                    </div>
                    <div className="health-item mb-3">
                      <div className="d-flex justify-content-between">
                        <span>Uptime</span>
                        <span>{systemHealth.uptime}</span>
                      </div>
                    </div>
                    <div className="health-item">
                      <div className="d-flex justify-content-between">
                        <span>Active Connections</span>
                        <span>{systemHealth.activeConnections}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Logs */}
          <div className="row mt-4">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h5>Activity Logs</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Timestamp</th>
                          <th>User</th>
                          <th>Action</th>
                          <th>IP Address</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activityLogs.map(log => (
                          <tr key={log.id}>
                            <td>{log.timestamp}</td>
                            <td>{log.user}</td>
                            <td>{log.action}</td>
                            <td>{log.ip}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;