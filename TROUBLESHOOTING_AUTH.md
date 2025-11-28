# Authentication Error Troubleshooting Guide

## Common Login/Register Errors

### **Problem 1: "Cannot POST /api/auth/login" or "Cannot POST /api/auth/register"**
**Cause:** Backend server is not running
**Solution:**
```bash
# Terminal 1: Start the backend
cd c:\Users\MAXI-PC\Desktop\my\Invest\server
npm run dev
# Should see: Server is running on port 3000
```

### **Problem 2: "CORS error" or "Network request failed"**
**Cause:** Frontend is making requests to wrong server address or CORS is misconfigured
**Solution:**
1. Check that backend is running on `http://localhost:3000`
2. Verify CORS settings in `server/server.js`:
```javascript
const corsOptions = {
  origin: 'http://localhost:5173',  // Make sure this matches your frontend URL
  credentials: true,                 // MUST be true for cookie authentication
  optionSuccessStatus: 200,
};
```
3. Check frontend API client at `Client/src/api/axios`:
```javascript
const BASE_URL = 'http://localhost:3000';
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  withCredentials: true  // MUST be true to send/receive cookies
});
```

### **Problem 3: "Invalid email or password"**
**Possible Causes:**
- User doesn't exist in database
- Password is incorrect
- Email is case-sensitive - try the exact email you registered with

**Debug Steps:**
1. Check if user exists in MongoDB:
```bash
# In MongoDB:
use invest  # or your database name
db.users.find({ email: "test@example.com" })
```
2. Make sure you registered first before trying to login

### **Problem 4: "Please verify your email first"**
**Cause:** User account created but email not verified
**Solution:**
1. In development, manually verify the email in MongoDB:
```bash
use invest
db.users.updateOne({ email: "test@example.com" }, { $set: { isVerified: true } })
```
2. Or use the verify-email endpoint:
```javascript
// In browser console or Postman:
fetch('http://localhost:3000/api/auth/verify-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ email: 'test@example.com' })
})
```

### **Problem 5: "Account is locked" (after 5 failed attempts)**
**Cause:** Too many failed login attempts
**Solution:**
1. Wait 15 minutes for automatic unlock, OR
2. Manually unlock in MongoDB:
```bash
use invest
db.users.updateOne({ email: "test@example.com" }, { $set: { lockUntil: null, failedLoginAttempts: 0 } })
```

### **Problem 6: Cookie not being set or sent**
**Cause:** `withCredentials` not configured properly
**Solution:**

**Frontend Fix** (`Client/src/api/axios`):
```javascript
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true  // ← THIS IS CRITICAL
});
```

**Backend Fix** (`server/server.js`):
```javascript
res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: (rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000
});
```

## Full Startup Checklist

### Terminal 1: Start Backend
```bash
cd server
npm install  # if needed
npm run dev  # watch mode with nodemon
```
Expected output:
```
Server is running on port 3000
MongoDB connected
```

### Terminal 2: Start Frontend (Development)
```bash
cd Client
npm install  # if needed
npm run dev  # watch mode
```
Expected output:
```
VITE v5.x.x building for production...
  ➜  Local:   http://localhost:5173/
```

### Terminal 3: Run Backend (for Build Testing)
```bash
cd Client
npm run build
npm run preview
```
Expected output:
```
  ➜  Local:   http://localhost:4173/
```

## Test Account Setup

If you need a test account, create one manually in MongoDB:

```javascript
// In MongoDB console:
use invest

db.users.insertOne({
  email: "test@example.com",
  password: "$2a$10$...",  // bcrypt hashed "password123"
  firstName: "Test",
  lastName: "User",
  role: "user",
  isVerified: true,
  twoFAEnabled: false,
  failedLoginAttempts: 0,
  lockUntil: null
})

// Then create portfolio:
db.portfolios.insertOne({
  userId: ObjectId("..."), // use the _id from user above
  totalValue: 0,
  availableCash: 0,
  investedAmount: 0,
  holdings: [],
  transactions: []
})
```

## Browser DevTools Debugging

1. **Open DevTools** (F12)
2. **Go to Network Tab**
3. **Try login**
4. **Look for:**
   - Request to `POST /api/auth/login`
   - Response status (200 = success, 401 = auth error, 500 = server error)
   - Response body with error message
   - Cookies tab to verify `token` cookie is set

## Backend Logs

Check for errors in the server terminal:
```
Console logs show:
- "No active session found." = not logged in (expected on first load)
- "Server error" = check backend logs for the actual error
- "Invalid email or password" = user not found or wrong password
```

## Quick Fixes

### Fix 1: Reset Everything
```bash
# Kill all node processes
taskkill /F /IM node.exe

# Clear MongoDB
# Delete the database and start fresh
```

### Fix 2: Clear Browser Cache
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty cache and hard refresh"

### Fix 3: Rebuild Frontend
```bash
cd Client
rm -r dist node_modules
npm install
npm run build
npm run preview
```

## Contact Information
If errors persist, check:
- MongoDB connection status
- Environment variables (.env file in server/)
- Network connectivity between frontend and backend
- Firewall blocking port 3000 or 5173
