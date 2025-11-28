# Build & Deployment Troubleshooting Guide

## Issue: Blank Page After `npm run build`

### ✅ Already Fixed
Your app had 4 critical issues that were preventing it from rendering. All have been fixed:
1. Router/AuthProvider hook order
2. Missing userRole export
3. Incorrect base path config
4. JSX fragment wrapper missing

---

## Common Issues & Solutions

### Issue 1: "Cannot find module" errors during build

**Symptoms:**
```
ERROR in ./src/components/home/login.jsx
Module not found: Error: Can't resolve './Login'
```

**Solution:**
Check file names match exactly (case-sensitive on Linux/Mac):
- `login.jsx` (lowercase) vs `Login.jsx` (uppercase)

**Fix:**
```bash
# Update import to match actual filename
import Login from './components/home/login.jsx';  // lowercase!
```

---

### Issue 2: "Cannot GET /" with production build

**Symptoms:**
- Build works but page won't load
- Console shows 404 errors

**Likely Cause:**
Server not configured for Single Page Application (SPA)

**Solution - For Local Testing:**
```bash
# Use the preview server (handles SPA routing)
npm run preview
```

**Solution - For Production Server:**
Configure your server to serve `index.html` for all routes:

**Nginx:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Apache:**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

### Issue 3: Blank page with "Loading..." stuck

**Symptoms:**
- Page shows "Loading..." and never progresses
- Network tab shows API errors

**Likely Cause:**
- Backend server not running
- CORS blocked the request
- API endpoints not implemented

**Debug Steps:**
1. Check browser DevTools (F12) → Network tab
2. Look for failed API calls (red)
3. Check backend logs: `npm run dev` in `/server` folder

**Fix:**
```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
cd Client
npm run dev
```

---

### Issue 4: Images not loading in production build

**Symptoms:**
- Build successful but images missing
- Warnings like "didn't resolve at build time"

**Solution:**
Place images in `Client/public/` folder instead of `src/images/`

```
Client/
├── public/          ← Static files go here
│   ├── images/
│   └── favicon.ico
└── src/
    ├── assets/      ← Only for imported components
    └── pages/
```

Import public assets as:
```jsx
// Public folder (no import needed)
<img src="/images/logo.png" alt="logo" />

// Src/assets (import required for bundling)
import logoImg from '../assets/logo.png';
```

---

### Issue 5: Authentication not working

**Symptoms:**
- Login succeeds but redirects back to login
- Protected routes always redirect to home

**Debug:**
Check AuthContext hooks:
```jsx
const { user, isAuthenticated, userRole } = useAuth();
console.log('Auth state:', { user, isAuthenticated, userRole });
```

**Common Fixes:**
1. Ensure backend `/api/auth/me` endpoint exists
2. Check cookies are being sent: Add `withCredentials: true` to axios
3. Verify JWT_SECRET matches between frontend and backend

---

## Debugging Tips

### 1. Enable Verbose Logging
```jsx
// In AuthContext.jsx
useEffect(() => {
  console.log('Auth state changed:', { user, isAuthenticated });
}, [user, isAuthenticated]);
```

### 2. Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Reload page
4. Look for failed requests (red)
5. Click each request to see response

### 3. Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for red error messages
4. Click to see full stack trace

### 4. Check Backend Logs
```bash
# Terminal should show requests
cd server
npm run dev

# Should see logs like:
# GET /api/auth/me 200 5ms
# POST /api/auth/login 200 15ms
```

---

## Build Optimization

### Check Build Size
```bash
npm run build
# Look at the dist/ output summary

# Each chunk should be:
# - Main bundle: < 250 KB (gzipped: < 100 KB)
# - Page chunks: < 100 KB each
```

### Reduce Bundle Size
1. **Remove unused packages:**
   ```bash
   npm uninstall unused-package
   ```

2. **Lazy load heavy components:**
   ```jsx
   const HeavyChart = lazy(() => import('./charts/HeavyChart'));
   ```

3. **Check dependencies:**
   ```bash
   npm ls
   ```

---

## Deployment Checklist

Before deploying to production:

- [ ] `npm run build` succeeds with no errors
- [ ] `npm run preview` displays page correctly
- [ ] No console errors in DevTools
- [ ] Backend API is accessible
- [ ] Environment variables are set
- [ ] CORS is configured for production domain
- [ ] Database is migrated/initialized
- [ ] SSL certificate is valid (if HTTPS)

---

## Environment Variables

### Backend (.env file in `/server`)
```env
MONGODB_URI=mongodb://localhost:27017/invest
JWT_SECRET=your-super-secret-key-change-this
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NODE_ENV=development
```

### Frontend (vite.config.jsx)
Currently uses hardcoded `BASE_URL = 'http://localhost:3000'`

For production, create `.env.production`:
```env
VITE_API_URL=https://api.yourdomain.com
```

Then update `Client/src/api/axios`:
```jsx
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

---

## Quick Commands Reference

```bash
# Development
npm run dev           # Start dev server
npm run build         # Create production build
npm run preview       # Test production build locally

# Deployment
npm run build         # Create dist/
# Deploy dist/ folder to your server

# Debugging
npm run build -- --debug    # More verbose output
NODE_DEBUG=* npm run dev    # Debug mode
```

---

## Need More Help?

1. **Check the AI Instructions:** `.github/copilot-instructions.md`
2. **Review Code:** Look at working examples in your codebase
3. **Check Dependencies:** `package.json` for versions
4. **Browser DevTools:** F12 → Console/Network for errors

---

**Last Updated:** November 28, 2025
**Status:** ✅ All fixes applied and tested
