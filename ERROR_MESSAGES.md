# ERROR MESSAGE REFERENCE

## When you see an error message trying to login/register, it usually means one of these:

### ❌ "Failed to fetch" or "NetworkError when attempting to fetch resource"
**What it means:** Frontend cannot reach the backend server
**Solutions:**
1. Start backend: `cd server` → `node server.js`
2. Check backend is on port 3000: `netstat -ano | findstr ":3000"`
3. Check CORS in `server/server.js` - origin should be `http://localhost:5173`

### ❌ "Invalid email or password"
**What it means:** Email doesn't exist OR password is wrong
**Solutions:**
1. Make sure you registered first before logging in
2. Check MongoDB has the user: `db.users.findOne({email: "your@email.com"})`
3. Try a different email/password
4. Create test account manually in MongoDB

### ❌ "Please verify your email first"
**What it means:** Account created but email not verified
**Solutions:**
1. In MongoDB: `db.users.updateOne({email: "your@email.com"}, {$set: {isVerified: true}})`
2. Or use backend endpoint to verify

### ❌ "User already exists"
**What it means:** You're trying to register with an email that's already in database
**Solutions:**
1. Use a different email address
2. Or delete the user from MongoDB first: `db.users.deleteOne({email: "your@email.com"})`

### ❌ "Account is locked due to too many failed login attempts"
**What it means:** 5+ failed login attempts triggered security lock
**Solutions:**
1. Wait 15 minutes for automatic unlock
2. Or unlock manually in MongoDB: `db.users.updateOne({email: "your@email.com"}, {$set: {lockUntil: null, failedLoginAttempts: 0}})`

### ❌ "Server error" or 500 status
**What it means:** Backend crashed or has a bug
**Solutions:**
1. Check backend terminal for error message
2. Check MongoDB is connected
3. Restart backend: `cd server` → `node server.js`

### ❌ "Passwords do not match"
**What it means:** Password and confirm password fields don't match during registration
**Solutions:**
1. Make sure both passwords are exactly the same
2. Check for typos/spaces

### ❌ "Password must be at least 8 characters long"
**What it means:** Registration validation failed
**Solutions:**
1. Use a password with 8 or more characters
2. Example: `MyPass123` (9 characters)

### ❌ "You must agree to the Terms & Conditions"
**What it means:** During registration, the agree checkbox wasn't checked
**Solutions:**
1. Check the "I agree to Terms & Conditions" checkbox
2. Try registering again

### ❌ "CORS policy: No 'Access-Control-Allow-Origin' header"
**What it means:** Backend CORS not configured correctly
**Solutions:**
1. Check `server/server.js` line 12-16:
```javascript
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  optionSuccessStatus: 200,
};
```
2. Make sure `credentials: true` is set
3. Make sure origin matches your frontend URL

---

## HOW TO CHECK WHAT ERROR YOU'RE GETTING:

### Step 1: Open Browser DevTools
Press **F12** or Right-click → Inspect

### Step 2: Go to Console Tab
You should see error messages here

### Step 3: Try login/register again
Watch for new error messages

### Step 4: Go to Network Tab
- Find the POST request to `/api/auth/login` or `/api/auth/register`
- Click on it
- Look at the Response tab
- See what error the server is returning

---

## QUICK TEST COMMANDS

### Test 1: Is backend running?
```bash
curl http://localhost:3000/
# Should return HTML or error, not connection refused
```

### Test 2: Is MongoDB connected?
```bash
# Check backend terminal for: "Connected successfully to MongoDB"
# If you see error, MongoDB is not running or connection string is wrong
```

### Test 3: Try registering a test user via terminal
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@test.com\",\"password\":\"Test@123456\",\"firstName\":\"Test\",\"lastName\":\"User\"}"
```

### Test 4: Try logging in via terminal
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@test.com\",\"password\":\"Test@123456\"}" \
  -v
```

---

## WHAT SHOULD HAPPEN WHEN YOU REGISTER

1. Form validation passes
2. Request sent to `/api/auth/register`
3. Backend receives data
4. Checks if user already exists
5. Hashes password
6. Creates new user in MongoDB
7. Creates portfolio for user
8. Returns success message
9. Frontend redirects to login page

If it stops anywhere in this chain, you get an error!

---

## WHAT SHOULD HAPPEN WHEN YOU LOGIN

1. Form validation passes
2. Request sent to `/api/auth/login` with email + password
3. Backend finds user by email
4. Compares password (bcrypt comparison)
5. Checks if email is verified
6. Creates JWT token
7. Sets httpOnly cookie with token
8. Returns user data
9. Frontend stores user in AuthContext
10. Frontend redirects to dashboard

If it stops anywhere, you get an error!

---

## MOST COMMON FIXES (DO THESE FIRST!)

### Fix 1: Start the backend
```bash
cd c:\Users\MAXI-PC\Desktop\my\Invest\server
node server.js
```

### Fix 2: Check MongoDB is running
```bash
mongod
# or check MongoDB Atlas connection string in .env
```

### Fix 3: Clear browser cache
```
F12 → Right-click refresh button → "Empty cache and hard refresh"
```

### Fix 4: Make test account in MongoDB
```bash
# Use MongoDB Compass or mongo shell
db.users.insertOne({
  email: "test@example.com",
  password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DvhKm6",
  firstName: "Test",
  lastName: "User",
  role: "user",
  isVerified: true,
  twoFAEnabled: false,
  failedLoginAttempts: 0,
  lockUntil: null
})
```

Then try login with: `test@example.com` / `password`

---

## STILL STUCK?

Include this info when asking for help:
1. What error message do you see?
2. What's in the backend terminal?
3. What's in the browser console (F12)?
4. What's the Network tab showing for the login request?
5. Did you start both `node server.js` and `npm run dev`?
6. Is MongoDB running?
