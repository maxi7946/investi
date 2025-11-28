# Complete Fix Guide: Login/Register Errors

## Quick Start - Do This First

### Step 1: Terminal 1 - Start MongoDB
If you have MongoDB installed locally:
```bash
mongod
# Should output: "waiting for connections on port 27017"
```

If using MongoDB Atlas cloud:
- Skip this step - your .env already has `MONGODB_URI`

### Step 2: Terminal 2 - Start Backend Server
```bash
cd c:\Users\MAXI-PC\Desktop\my\Invest\server
npm install  # Install missing dependencies
node server.js
# Should output: "Connected successfully to MongoDB"
#                "Server is running at http://localhost:3000"
```

### Step 3: Terminal 3 - Start Frontend Dev Server
```bash
cd c:\Users\MAXI-PC\Desktop\my\Invest\Client
npm run dev
# Should output: "Local: http://localhost:5173/"
```

### Step 4: Open Browser
```
http://localhost:5173/
```

---

## Common Issues & Solutions

### Issue 1: "Could not connect to MongoDB"

**Possible Cause 1: MongoDB not running locally**
```bash
# Check if mongod is running:
netstat -ano | findstr "27017"

# If no output, start MongoDB:
mongod  # Windows: C:\Program Files\MongoDB\Server\bin\mongod.exe
```

**Possible Cause 2: Invalid MongoDB Atlas connection string**
```env
# Check .env in server/ folder:
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/

# Make sure:
# - USERNAME and PASSWORD are correct (URL encoded)
# - Cluster name is correct
# - Database name is correct (if specified)
```

**Possible Cause 3: Network connectivity issue**
```bash
# Test MongoDB connection:
npm install -g mongodb-cli-tools
mongosh "mongodb+srv://username:password@cluster.mongodb.net/"
```

### Issue 2: "Cannot POST /api/auth/login" or Network Error

**Cause:** Backend server not running on port 3000

**Solution:**
```bash
# Check if port 3000 is in use:
netstat -ano | findstr ":3000"

# If nothing shows, backend is not running:
cd c:\Users\MAXI-PC\Desktop\my\Invest\server
node server.js

# Should see:
# Connected successfully to MongoDB
# Server is running at http://localhost:3000
```

### Issue 3: CORS Error or "Access to XMLHttpRequest blocked"

**Cause:** CORS not configured properly

**Check Backend** (`server/server.js` lines 12-16):
```javascript
const corsOptions = {
  origin: 'http://localhost:5173',  // Must match your frontend
  credentials: true,                  // MUST be true for cookies
  optionSuccessStatus: 200,
};
```

**Check Frontend** (`Client/src/api/axios`):
```javascript
export const axiosPrivate = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true  // MUST be true
});
```

### Issue 4: "Invalid email or password"

**Possible Causes:**
1. User doesn't exist in database
2. Email/password is incorrect
3. Account not verified

**Solutions:**

**Solution A: Create test account manually**
```javascript
// In MongoDB shell or compass:
use invest_app

db.users.insertOne({
  email: "test@example.com",
  password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DvhKm6",  // bcrypt hash of "password"
  firstName: "Test",
  lastName: "User",
  role: "user",
  isVerified: true,
  twoFAEnabled: false,
  failedLoginAttempts: 0,
  lockUntil: null,
  createdAt: new Date(),
  updatedAt: new Date()
})

// Then create portfolio:
// Get the _id from the user you just created and use it here:
db.portfolios.insertOne({
  userId: ObjectId("PASTE_USER_ID_HERE"),
  totalValue: 0,
  availableCash: 0,
  investedAmount: 0,
  holdings: [],
  transactions: []
})
```

**Solution B: Register a new account first**
1. Go to `/signup`
2. Fill in the form
3. Register the account
4. Verify email in MongoDB:
```javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { isVerified: true } }
)
```

**Solution C: Check what's in the database**
```javascript
// See all users:
db.users.find({})

// See if user exists:
db.users.findOne({ email: "test@example.com" })
```

### Issue 5: "Please verify your email first"

**Cause:** Email verification is required

**Fix: Manually verify in MongoDB**
```javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { isVerified: true } }
)
```

### Issue 6: "Account is locked" (after 5 failed attempts)

**Cause:** Too many failed login attempts (security feature)

**Fix: Unlock account**
```javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { lockUntil: null, failedLoginAttempts: 0 } }
)
```

---

## Setup Verification Checklist

### ✅ MongoDB
- [ ] MongoDB is running (local or Atlas)
- [ ] `.env` has correct `MONGODB_URI`
- [ ] Can connect to MongoDB Atlas/Local

### ✅ Backend
- [ ] All dependencies installed: `npm install`
- [ ] `.env` file exists with correct values
- [ ] Server starts without errors
- [ ] Listening on port 3000
- [ ] Connected to MongoDB

### ✅ Frontend
- [ ] All dependencies installed: `npm install`
- [ ] `Client/src/api/axios` has `withCredentials: true`
- [ ] Dev server running on port 5173
- [ ] Can access `http://localhost:5173/`

### ✅ Browser
- [ ] No CORS errors in DevTools Console
- [ ] Network tab shows requests to `localhost:3000`
- [ ] Cookies are being set (DevTools > Application > Cookies)

---

## Full Test Workflow

### 1. Clear Everything
```bash
# Stop all processes (Ctrl+C in all terminals)

# Clear browser cache:
# DevTools (F12) → Right-click refresh → "Empty cache and hard refresh"

# Clear MongoDB (optional):
# Delete the database and start fresh
```

### 2. Start Services
```bash
# Terminal 1:
mongod

# Terminal 2:
cd server && node server.js

# Terminal 3:
cd Client && npm run dev
```

### 3. Test Registration
1. Open `http://localhost:5173/signup`
2. Fill in form:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Password: Test@123456 (8+ chars)
   - Confirm Password: Test@123456
   - Agree to Terms: checked
3. Click Register
4. Should see success message
5. Verify email in MongoDB (if needed)

### 4. Test Login
1. Open `http://localhost:5173/login`
2. Enter:
   - Email: test@example.com
   - Password: Test@123456
3. Click Login
4. Should navigate to dashboard

### 5. Debug in Browser
If login fails:
1. Open DevTools (F12)
2. Go to Network tab
3. Try login again
4. Look for `POST /api/auth/login` request
5. Check:
   - Status code (200 = success, 401 = auth error, 500 = server error)
   - Response body (error message)
   - Request body (email/password sent correctly)
6. Go to Console tab
7. Look for any JavaScript errors

---

## Environment Setup (.env file)

**Location:** `server/.env`

```env
# Google OAuth (optional for login/register, only needed for Google Sign-In)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# JWT Secret (IMPORTANT - keep this secure!)
JWT_SECRET=my-super-secret-jwt-key-2024

# MongoDB Connection
# For Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/invest_app

# For MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/invest_app?retryWrites=true&w=majority
```

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `server/server.js` | Backend API endpoints (lines 200+ for auth) |
| `server/.env` | Backend configuration |
| `Client/src/context/AuthContext.jsx` | Frontend auth state management |
| `Client/src/components/home/login.jsx` | Login page component |
| `Client/src/components/home/signup.jsx` | Register page component |
| `Client/src/api/axios` | Axios configuration for API calls |

---

## Package Installation

If you get "missing module" errors:

```bash
# Backend dependencies:
cd server
npm install

# Install specific package if needed:
npm install cookie-parser mongodb

# Frontend dependencies:
cd Client
npm install
```

---

## Getting Help

When reporting issues, include:
1. Terminal output (error message)
2. Browser DevTools Network tab screenshot
3. Browser Console errors (F12)
4. What you were trying to do (register/login)
5. Expected vs actual result

---

## Next Steps After Login Works

1. **Test Dashboard:** Login and navigate to user/admin dashboard
2. **Create Portfolio:** Add initial funds or holdings
3. **Test Other Features:** Verify all pages load correctly
4. **Production Build:** Run `npm run build` and `npm run preview`
5. **Deployment:** Follow deployment guide for your hosting platform
