# 🚀 Invest App - Complete Setup & Debugging Guide

## 📋 What Was Fixed

### ✅ Code Issues (Already Fixed)
1. **Router Hook Error** - Moved Router wrapper outside AuthProvider to fix useNavigate() hook issues
2. **Protected Route Bug** - Fixed ProtectedRoute to properly read user.role from AuthContext
3. **Missing Dependencies** - Added `cookie-parser` and `mongodb` to backend package.json
4. **Build Issues** - Fixed Vite base path configuration
5. **Fragment Wrapper** - Fixed App.jsx JSX structure

### ✅ Files Created (Reference Guides)
- `AUTH_SETUP_GUIDE.md` - Complete setup instructions
- `ERROR_MESSAGES.md` - Error message reference guide
- `TROUBLESHOOTING_AUTH.md` - Detailed troubleshooting steps
- `diagnose.js` - Diagnostic tool to test connections
- `.github/copilot-instructions.md` - AI coding agent guide

---

## 🏃 Quick Start (DO THIS NOW)

### Terminal 1: Start MongoDB
```bash
mongod
# If you get "command not found", MongoDB is not installed locally
# In that case, ensure MONGODB_URI in server/.env points to MongoDB Atlas
```

### Terminal 2: Start Backend
```bash
cd c:\Users\MAXI-PC\Desktop\my\Invest\server
npm install  # Install dependencies if not done yet
node server.js

# You should see:
# Connected successfully to MongoDB
# Server is running at http://localhost:3000
```

### Terminal 3: Start Frontend
```bash
cd c:\Users\MAXI-PC\Desktop\my\Invest\Client
npm run dev

# You should see:
# ➜  Local:   http://localhost:5173/
```

### Browser
```
Open: http://localhost:5173/
```

---

## ⚠️ If You Get Login/Register Errors

### Error 1: "Failed to fetch" or Network Error
```bash
# Backend is not running!
cd server
node server.js
```

### Error 2: "Invalid email or password"
```bash
# User doesn't exist. Two options:

# Option A: Register a new account first
# Go to http://localhost:5173/signup

# Option B: Create test account in MongoDB
db.users.insertOne({
  email: "test@example.com",
  password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DvhKm6",
  firstName: "Test",
  lastName: "User",
  role: "user",
  isVerified: true,
  twoFAEnabled: false
})
```

### Error 3: "Please verify your email first"
```bash
# Manually verify in MongoDB:
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { isVerified: true } }
)
```

### Error 4: "Could not connect to MongoDB"
```bash
# Check your .env file in server/
# Make sure MONGODB_URI is correct:

# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/invest_app

# For MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/invest_app?retryWrites=true&w=majority
```

---

## 🔍 Diagnostic Steps

### Step 1: Verify Backend is Running
```bash
curl http://localhost:3000/
# Should return something (not "Connection refused")
```

### Step 2: Check Browser Console (F12)
- Look for JavaScript errors
- Look for Network errors
- Check for CORS issues

### Step 3: Check Network Tab (F12)
1. Open Network tab
2. Try to register/login
3. Find the POST request to `/api/auth/register` or `/api/auth/login`
4. Check Response tab for error message

### Step 4: Check Backend Terminal
- Should show requests coming in
- Should show MongoDB connected
- Should show any errors

### Step 5: Use Diagnostic Tool
```bash
node diagnose.js
# This will test all connections
```

---

## 📁 Key Files

| File | Purpose | Edit This If... |
|------|---------|-----------------|
| `server/server.js` | Backend API | Adding new endpoints |
| `server/.env` | Backend config | Changing DB/JWT secret |
| `Client/src/context/AuthContext.jsx` | Auth state | Modifying auth logic |
| `Client/src/components/home/login.jsx` | Login page | Changing login form |
| `Client/src/components/home/signup.jsx` | Register page | Changing register form |
| `Client/src/api/axios` | API calls | Changing API URL |

---

## 🛠️ Troubleshooting Checklist

- [ ] MongoDB is running (check `mongod` terminal)
- [ ] Backend is running on port 3000 (check `server` terminal)
- [ ] Frontend is running on port 5173 (check `Client` terminal)
- [ ] Can access http://localhost:5173/ in browser
- [ ] Browser console has no errors (F12)
- [ ] Backend terminal shows "Connected successfully to MongoDB"
- [ ] When you click login, you see POST request in Network tab
- [ ] Can register a new account
- [ ] After registering, can login with that account

---

## 📞 If Nothing Works

### Option 1: Restart Everything
```bash
# Kill all terminals (Ctrl+C)
# Wait 5 seconds
# Start fresh:

# Terminal 1: mongod
mongod

# Terminal 2: cd server && node server.js
cd c:\Users\MAXI-PC\Desktop\my\Invest\server
node server.js

# Terminal 3: cd Client && npm run dev
cd c:\Users\MAXI-PC\Desktop\my\Invest\Client
npm run dev
```

### Option 2: Clear Cache
```
Browser DevTools (F12) → Right-click refresh → "Empty cache and hard refresh"
```

### Option 3: Reinstall Dependencies
```bash
# Backend:
cd server
rm -r node_modules
npm install

# Frontend:
cd Client
rm -r node_modules
npm install
```

### Option 4: Check MongoDB
```bash
# Is MongoDB running?
netstat -ano | findstr "27017"

# If port 27017 is not listed, MongoDB is not running
# Start it:
mongod

# Is MongoDB accessible?
mongo  # or mongosh
# Should connect without errors
```

---

## 🔗 Connection Flow

```
User enters email/password
        ↓
Browser sends POST to http://localhost:3000/api/auth/login
        ↓
Backend receives request
        ↓
Backend queries MongoDB for user
        ↓
Backend compares password (bcrypt)
        ↓
Backend creates JWT token
        ↓
Backend sets httpOnly cookie
        ↓
Backend returns user data
        ↓
Frontend stores in AuthContext
        ↓
Frontend redirects to dashboard
```

If it breaks at any step, you get an error!

---

## 📊 Expected Ports

| Service | Port | URL |
|---------|------|-----|
| MongoDB | 27017 | (internal) |
| Backend | 3000 | http://localhost:3000 |
| Frontend Dev | 5173 | http://localhost:5173 |
| Frontend Preview | 4173 | http://localhost:4173 |

---

## 🎯 Next Steps

1. **Start all 3 services** (MongoDB, Backend, Frontend)
2. **Try to register** a new account
3. **Try to login** with that account
4. **Navigate to dashboard** to verify login works
5. **Test other features** (portfolio, deposits, etc.)
6. **Build for production** when ready: `npm run build`

---

## 📝 Notes

- All changes have been saved automatically
- No additional configuration needed
- MongoDB connection must be working
- Backend and Frontend must both be running
- CORS is configured to allow localhost:5173
- Authentication uses httpOnly cookies (secure)

---

## ✅ Completion Status

| Task | Status |
|------|--------|
| Fix broken routes | ✅ Done |
| Fix auth context | ✅ Done |
| Add missing dependencies | ✅ Done |
| Create setup guide | ✅ Done |
| Create error reference | ✅ Done |
| Create troubleshooting guide | ✅ Done |
| Create diagnostic tool | ✅ Done |

**All code fixes are complete! Just need to start the services and test.**

---

## 🆘 Need Help?

When asking for help, provide:
1. The exact error message you see
2. What's in the backend terminal
3. What's in the browser console (F12)
4. Which step you're on (registration/login/dashboard)
5. Have you started: mongod? (yes/no)
6. Have you started: node server.js? (yes/no)
7. Have you started: npm run dev? (yes/no)

This will help diagnose the issue quickly!
