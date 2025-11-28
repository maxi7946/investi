require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const app = express();
const cors = require('cors');
const corsOptions ={
  origin:'http://localhost:5173', //access-control-allow-origin
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// --- MongoDB Connection Setup ---
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const mongoClient = new MongoClient(MONGODB_URI);
let db;
let usersCollection;
let portfoliosCollection;
let adminDataCollection;

// --- End MongoDB Connection Setup ---

// Passport configuration
app.use(passport.initialize());

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Find or create user based on Google profile
      let user = await usersCollection.findOne({ email: profile.emails[0].value });

      if (!user) {
        // Create new user from Google profile
        const newUser = {
          email: profile.emails[0].value,
          password: '', // No password for OAuth users
          role: 'user',
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          isVerified: true, // Google accounts are pre-verified
          twoFAEnabled: false,
          googleId: profile.id
        };
        const result = await usersCollection.insertOne(newUser);
        user = { ...newUser, _id: result.insertedId };

        // Create initial portfolio
        await portfoliosCollection.insertOne({
          userId: user._id,
          totalValue: 0,
          availableCash: 0,
          investedAmount: 0,
          holdings: [],
          transactions: []
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await usersCollection.findOne({ _id: new ObjectId(id) });
  done(null, user);
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = req.cookies.token || (authHeader && authHeader.split(' ')[1]);

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Google OAuth Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login' }),
  (req, res) => {
    // Successful authentication, redirect to dashboard
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email, role: req.user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set the token in an httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    // Redirect to the appropriate dashboard
    res.redirect(req.user.role === 'admin' ? 'http://localhost:5173/admin-dashboard' : 'http://localhost:5173/user-dashboard');
  }
);

// Authentication Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(403).json({ message: `Account is locked. Please try again in ${remainingTime} minutes.` });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      const failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      // Lock account after 5 failed attempts for 15 minutes
      const MAX_ATTEMPTS = 5;
      if (failedLoginAttempts >= MAX_ATTEMPTS) {
        await usersCollection.updateOne({ _id: user._id }, {
          $set: { lockUntil: Date.now() + 15 * 60 * 1000 }, // Lock for 15 minutes
          $inc: { failedLoginAttempts: 1 }
        });
        return res.status(403).json({ message: 'Account locked due to too many failed login attempts. Please try again in 15 minutes.' });
      }
      await usersCollection.updateOne({ _id: user._id }, {
        $set: { failedLoginAttempts }
      });

      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email first' });
    }

    // Reset lock on successful login
    await usersCollection.updateOne({ _id: user._id }, { $set: { failedLoginAttempts: 0, lockUntil: null } });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: rememberMe ? '30d' : '24h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict',
      maxAge: (rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000 // 30 days or 1 day
    });

    res.json({
      // Token is now in an httpOnly cookie, not in the response body
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        twoFAEnabled: user.twoFAEnabled
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, dateOfBirth, agreeToTerms } = req.body;

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserPayload = {
      email,
      password: hashedPassword,
      role: 'user',
      firstName,
      lastName,
      phone,
      dateOfBirth,
      isVerified: false,
      twoFAEnabled: false
    };

    const result = await usersCollection.insertOne(newUserPayload);

    // Create initial portfolio
    await portfoliosCollection.insertOne({
      userId: result.insertedId,
      totalValue: 0,
      availableCash: 0,
      investedAmount: 0,
      holdings: [],
      transactions: []
    });

    res.status(201).json({ message: 'User registered successfully. Please verify your email.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/verify-email', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await usersCollection.findOne({ email });
    if (user) {
      await usersCollection.updateOne({ email }, { $set: { isVerified: true } });
      res.json({ message: 'Email verified successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await usersCollection.findOne({ email });
    if (user) {
      // In real app, send reset email
      res.json({ message: 'Password reset email sent' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/verify-2fa', authenticateToken, (req, res) => {
  const { code } = req.body;
  // Mock 2FA verification
  if (code === '123456') {
    res.json({ message: '2FA verified successfully' });
  } else {
    res.status(401).json({ message: 'Invalid 2FA code' });
  }
});

// User Routes
app.get('/api/user/portfolio', authenticateToken, async (req, res) => {
  const portfolio = await portfoliosCollection.findOne({ userId: new ObjectId(req.user.id) });
  if (portfolio) {
    res.json(portfolio);
  } else {
    res.status(404).json({ message: 'Portfolio not found' });
  }
});

app.get('/api/user/transactions', authenticateToken, async (req, res) => {
  const portfolio = await portfoliosCollection.findOne({ userId: new ObjectId(req.user.id) });
  if (portfolio) {
    res.json(portfolio.transactions);
  } else {
    res.json([]);
  }
});

app.post('/api/user/deposit', authenticateToken, async (req, res) => {
  const { amount } = req.body;
  const portfolio = await portfoliosCollection.findOne({ userId: new ObjectId(req.user.id) });
  if (portfolio) {
    const newTransaction = {
      id: portfolio.transactions.length + 1,
      date: new Date().toISOString().split('T')[0],
      type: 'Deposit',
      asset: 'USD',
      quantity: 1,
      price: amount,
      total: amount
    };
    await portfoliosCollection.updateOne(
      { userId: new ObjectId(req.user.id) },
      { $inc: { availableCash: amount, totalValue: amount }, $push: { transactions: newTransaction } }
    );
    res.json({ message: 'Deposit successful', portfolio });
  } else {
    res.status(404).json({ message: 'Portfolio not found' });
  }
});

app.post('/api/user/withdraw', authenticateToken, async (req, res) => {
  const { amount } = req.body;
  const portfolio = await portfoliosCollection.findOne({ userId: new ObjectId(req.user.id) });
  if (portfolio && portfolio.availableCash >= amount) {    
    const newTransaction = {
      id: portfolio.transactions.length + 1,
      date: new Date().toISOString().split('T')[0],
      type: 'Withdraw',
      asset: 'USD',
      quantity: 1,
      price: -amount,
      total: -amount
    };
    const updatedPortfolio = await portfoliosCollection.findOneAndUpdate(
      { userId: new ObjectId(req.user.id) },
      { $inc: { availableCash: -amount, totalValue: -amount }, $push: { transactions: newTransaction } }
    );
    res.json({ message: 'Withdrawal successful', portfolio: updatedPortfolio });
  } else {
    res.status(400).json({ message: 'Insufficient funds' });
  }
});

// Admin Routes
app.get('/api/admin/metrics', authenticateToken, requireAdmin, async (req, res) => {
  const doc = await adminDataCollection.findOne({ name: 'platformMetrics' });
  res.json(doc.data);
});

app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  // This would be a more complex query in a real app
  const users = await usersCollection.find({ role: 'user' }).toArray();
  res.json(users);
});

app.get('/api/admin/transactions', authenticateToken, requireAdmin, async (req, res) => {
  // This would be a more complex query in a real app
  const data = await portfoliosCollection.find({}, { projection: { 'transactions': 1, 'userId': 1 } }).toArray();
  res.json(data);
});

app.put('/api/admin/users/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    // This is a mock implementation, in reality you'd update the main user document
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (user) {
      await usersCollection.updateOne({ _id: new ObjectId(id) }, { $set: { status } });
      res.json({ message: 'User status updated', user: { ...user, status } });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/admin/settings', authenticateToken, requireAdmin, (req, res) => {
  res.json({
    tradingFees: 0.25,
    marketHours: { open: '09:30', close: '16:00' },
    minDeposit: 100,
    maxWithdrawal: 50000,
    twoFAEnforced: true,
    maintenanceMode: false
  });
});

app.put('/api/admin/settings', authenticateToken, requireAdmin, (req, res) => {
  // In real app, update settings in database
  res.json({ message: 'Settings updated successfully' });
});

// Wallet Management Routes
app.get('/api/admin/wallets', authenticateToken, requireAdmin, async (req, res) => {
  const doc = await adminDataCollection.findOne({ name: 'wallets' });
  res.json(doc.data);
});

app.post('/api/admin/wallets', authenticateToken, requireAdmin, async (req, res) => {
  const { name, address, currency } = req.body;
  const newWallet = {
    name,
    address,
    balance: 0,
    currency: currency || 'BTC',
    isActive: true,
    lastUpdated: new Date().toISOString()
  };
  await adminDataCollection.updateOne({ name: 'wallets' }, { $push: { data: { ...newWallet, id: new ObjectId() } } });
  res.json({ message: 'Wallet added successfully', wallet: newWallet });
});

app.put('/api/admin/wallets/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, address, balance, isActive } = req.body;
  // This is a mock implementation. A real implementation would be more complex.
  const wallet = null; // adminData.wallets.find(w => w.id == id);
  if (wallet) {
    if (name) wallet.name = name;
    if (address) wallet.address = address;
    if (balance !== undefined) {
      wallet.balance = balance;
      wallet.lastUpdated = new Date().toISOString();
    }
    if (isActive !== undefined) wallet.isActive = isActive;
    res.json({ message: 'Wallet updated successfully', wallet });
  } else {
    res.status(404).json({ message: 'Wallet not found' });
  }
});

app.delete('/api/admin/wallets/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const result = await adminDataCollection.updateOne({ name: 'wallets' }, { $pull: { data: { id: new ObjectId(id) } } });
  if (result.modifiedCount > 0) {
    res.json({ message: 'Wallet deleted successfully' });
  } else {
    res.status(404).json({ message: 'Wallet not found' });
  }
});

// Investment Plans Management Routes
app.get('/api/admin/plans', authenticateToken, requireAdmin, async (req, res) => {
  const doc = await adminDataCollection.findOne({ name: 'investmentPlans' });
  res.json(doc.data);
});

app.post('/api/admin/plans', authenticateToken, requireAdmin, async (req, res) => {
  const { name, minAmount, maxAmount, profitPercentage, profitType, duration, description } = req.body;
  const newPlan = {
    name,
    minAmount,
    maxAmount,
    profitPercentage,
    profitType,
    duration,
    description,
    isActive: true
  };
  await adminDataCollection.updateOne({ name: 'investmentPlans' }, { $push: { data: { ...newPlan, id: new ObjectId() } } });
  res.json({ message: 'Plan added successfully', plan: newPlan });
});

app.put('/api/admin/plans/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const plan = null; // adminData.investmentPlans.find(p => p.id == id);
  if (plan) {
    Object.assign(plan, updates);
    res.json({ message: 'Plan updated successfully', plan });
  } else {
    res.status(404).json({ message: 'Plan not found' });
  }
});

// User Investment Routes
app.get('/api/user/plans', authenticateToken, async (req, res) => {
  const doc = await adminDataCollection.findOne({ name: 'investmentPlans' });
  res.json(doc.data.filter(plan => plan.isActive));
});

app.post('/api/user/invest', authenticateToken, async (req, res) => {
  const { planId, amount, walletId } = req.body;
  const plan = (await adminDataCollection.findOne({ name: 'investmentPlans', 'data.id': new ObjectId(planId) }))?.data.find(p => p.id.equals(planId));
  const wallet = (await adminDataCollection.findOne({ name: 'wallets', 'data.id': new ObjectId(walletId) }))?.data.find(w => w.id.equals(walletId) && w.isActive);

  if (!plan) {
    return res.status(404).json({ message: 'Plan not found' });
  }

  if (!wallet) {
    return res.status(404).json({ message: 'Wallet not found or inactive' });
  }

  if (amount < plan.minAmount || amount > plan.maxAmount) {
    return res.status(400).json({ message: 'Investment amount is outside plan limits' });
  }

  if (wallet.balance < amount) {
    return res.status(400).json({ message: 'Insufficient wallet balance' });
  }

  // Deduct from wallet
  await adminDataCollection.updateOne({ name: 'wallets', 'data.id': new ObjectId(walletId) }, { $inc: { 'data.$.balance': -amount }, $set: { 'data.$.lastUpdated': new Date().toISOString() } });

  // Create investment record
  const investment = {
    id: Date.now(),
    userId: new ObjectId(req.user.id),
    planId,
    amount,
    walletId,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    profitPercentage: plan.profitPercentage,
    profitType: plan.profitType
  };

  // Add to user's portfolio (mock)
  const userPortfolio = await portfoliosCollection.findOne({ userId: new ObjectId(req.user.id) });
  if (userPortfolio) {
    const newTransaction = {
      id: userPortfolio.transactions.length + 1,
      date: new Date().toISOString().split('T')[0],
      type: 'Investment',
      asset: plan.name,
      quantity: 1,
      price: amount,
      total: amount
    };
    await portfoliosCollection.updateOne(
      { userId: new ObjectId(req.user.id) },
      { $inc: { investedAmount: amount, totalValue: amount }, $push: { transactions: newTransaction } }
    );
  }

  res.json({
    message: 'Investment successful',
    investment,
    remainingBalance: wallet.balance - amount
  });
});

// Market Data Routes (Mock)
app.get('/api/market/prices', (req, res) => {
  res.json({
    AAPL: { price: 150.25, change: 2.5 },
    MSFT: { price: 280.50, change: -1.2 },
    TSLA: { price: 220.75, change: 5.8 },
    GOOGL: { price: 2750.00, change: -2.1 }
  });
});

app.get('/api/market/news', (req, res) => {
  res.json([
    'Tech stocks rally on AI optimism',
    'Federal Reserve signals potential rate cut',
    'Oil prices surge amid supply concerns'
  ]);
});

// Test route
app.get('/', (req, res) => {
  res.json('Hello World!');
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

async function seedDatabase() {
  try {
    // --- Seed Admin User ---
    const adminUser = await usersCollection.findOne({ email: 'admin@example.com' });
    if (!adminUser) {
      console.log('Admin user not found, creating one...');
      const hashedPassword = await bcrypt.hash('admin', 10); // Default password is 'admin'
      await usersCollection.insertOne({
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        isVerified: true,
        twoFAEnabled: true,
        failedLoginAttempts: 0,
        lockUntil: null
      });
      console.log('Admin user created with email: admin@example.com and password: admin');
    }

    // --- Seed Admin Data ---
    const metrics = await adminDataCollection.findOne({ name: 'platformMetrics' });
    if (!metrics) {
      await adminDataCollection.insertOne({
        name: 'platformMetrics',
        data: {
          totalUsers: 0,
          activeUsers24h: 0,
          totalAUM: 0,
          platformRevenue: 0,
          totalPnL: 0
        }
      });
    }

    const wallets = await adminDataCollection.findOne({ name: 'wallets' });
    if (!wallets) {
      await adminDataCollection.insertOne({
        name: 'wallets',
        data: [
          {
            id: new ObjectId(),
            name: 'Main Payment Wallet',
            address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
            balance: 50000,
            currency: 'BTC',
            isActive: true,
            lastUpdated: new Date().toISOString()
          }
        ]
      });
    }

    const plans = await adminDataCollection.findOne({ name: 'investmentPlans' });
    if (!plans) {
      await adminDataCollection.insertOne({
        name: 'investmentPlans',
        data: [
          {
            id: new ObjectId(),
            name: 'Bronze Plan',
            minAmount: 50,
            maxAmount: 4999,
            profitPercentage: 10,
            profitType: 'daily',
            duration: 7,
            description: 'Perfect for beginners starting their investment journey',
            isActive: true
          },
          {
            id: new ObjectId(),
            name: 'Silver Plan',
            minAmount: 5000,
            maxAmount: 9999,
            profitPercentage: 15,
            profitType: 'daily',
            duration: 15,
            description: 'Great returns for intermediate investors',
            isActive: true
          },
          {
            id: new ObjectId(),
            name: 'Gold Plan',
            minAmount: 10000,
            maxAmount: 14999,
            profitPercentage: 20,
            profitType: 'daily',
            duration: 21,
            description: 'Premium plan with excellent daily returns',
            isActive: true
          }
        ]
      });
    }

    console.log('Database seeding completed.');

  } catch (error) {
    console.error('Error during database seeding:', error);
    process.exit(1);
  }
}

async function startServer() {
  try {
    await mongoClient.connect();
    console.log('Connected successfully to MongoDB');
    db = mongoClient.db('invest_app');
    usersCollection = db.collection('users');
    portfoliosCollection = db.collection('portfolios');
    adminDataCollection = db.collection('admin_data');

    // Seed the database with initial data if necessary
    await seedDatabase();

    app.listen(3000, () => {
      console.log(`Server is running at http://localhost:3000`);
    });
  } catch (e) {
    console.error("Could not connect to MongoDB", e);
    process.exit(1);
  }
}

startServer();