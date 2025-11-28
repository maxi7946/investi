# AI Coding Agent Instructions for Invest Application

## Project Overview
**Invest** is a full-stack investment platform with a React frontend (Vite) and Express.js backend (MongoDB). The app features user authentication, role-based dashboards (admin/user), and portfolio management using JWT + httpOnly cookies.

**Stack:**
- Frontend: React 18, React Router v6, Vite, Bootstrap 5, Axios
- Backend: Express.js, MongoDB, JWT, Passport (Google OAuth), bcryptjs
- Dev Port: 5173 (Client), 3000 (Server)

## Architecture & Key Patterns

### Authentication Flow
- **Location:** `Client/src/context/AuthContext.jsx`
- **Pattern:** React Context API + httpOnly cookies (JWT stored server-side)
- **Key Methods:** `login()`, `register()`, `logout()`, session check on app mount
- **Critical:** Always use `apiClient.post('/api/auth/...')` endpoints; never store tokens in localStorage
- **Backend:** Credentials sent to `/api/auth/login`, `/api/auth/register`, `/api/auth/logout` (server/server.js lines 200-300)

### Protected Routes
- **Location:** `Client/src/components/ProtectedRoute.jsx`
- **Pattern:** HOC that checks `isAuthenticated` + `requiredRole` from AuthContext
- **Usage:** Wrap dashboard routes in `<ProtectedRoute requiredRole="admin">` or `requiredRole="user"`
- **Redirect:** Unauthenticated users → `/login`; insufficient role → homepage

### API Client Setup
- **Location:** `Client/src/api/axios` (two instances)
- **Default:** `BASE_URL = 'http://localhost:3000'` (production: adjust base URL)
- **Key:** Use `axiosPrivate` for authenticated requests; `withCredentials: true` enables cookie inclusion
- **Pattern:** All API calls must include proper error handling from `error.response?.data?.message`

### Component Organization
- **Pages:** `Client/src/pages/` — Full page views (HomePage.jsx, UserDashboard.jsx, AdminDashboard.jsx)
- **Components:** `Client/src/components/` — Reusable UI (header/, home/, footer/, common/)
- **Layout:** `Client/src/components/layout/Layout.jsx` — Wraps all routes with Header/Footer

### Code Splitting & Performance
- **Pattern:** Lazy load pages with `lazy()` + `Suspense` in `App.jsx`
- **Example:** `const HomePage = lazy(() => import('./pages/HomePage.jsx'))`
- **Reason:** Reduces initial bundle size; each page loads separately

## Critical Developer Workflows

### Frontend Development
```bash
# Terminal 1: Start Vite dev server
cd Client
npm install  # if needed
npm run dev  # runs on http://localhost:5173

# Build for production
npm run build
npm run preview  # test production build
```

### Backend Development
```bash
# Terminal 2: Start Node server with auto-reload
cd server
npm install  # if needed
npm run dev  # uses nodemon (watches changes)

# Production
npm start
```

### Environment Variables
- **Backend:** `server/` needs `.env` with `MONGODB_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- **Frontend:** Vite reads from `.env` files; BASE URL hardcoded in `api/axios`

## Project-Specific Conventions

### Naming & File Structure
- **Components:** PascalCase (e.g., `UserDashboard.jsx`)
- **Context/Hooks:** camelCase with `.jsx` extension (e.g., `useAuth.jsx`)
- **Routes:** Kebab-case paths (e.g., `/user-dashboard`, `/admin-dashboard`)
- **CSS:** Bootstrap classes + custom `style.css` (avoid inline styles for consistency)

### Data Flow Patterns
1. **Auth:** User logs in → `AuthContext.login()` → JWT cookie set by server → `setUser()` + navigate
2. **API Calls:** Component → `useAuth()` → `apiClient.post()` → backend → response handling
3. **State:** Use Context for global auth; local state (`useState`) for component-specific UI

### Key Gotchas
- **Session Check:** AuthContext runs `checkSession()` on mount; may cause initial loading state flicker (use loading prop if needed)
- **Role Check:** `ProtectedRoute` checks `requiredRole` from AuthContext, NOT from props
- **CORS:** Backend allows only `http://localhost:5173` in CORS config; adjust for production
- **Vite Base:** `base: '/invest/'` in production; ensure backend routes don't conflict

## Integration Points

### Frontend ↔ Backend Communication
- All requests go through `Client/src/api/axios` (base: `http://localhost:3000`)
- Backend endpoints: `/api/auth/*`, `/api/user/*`, `/api/admin/*`
- Cookies handled automatically by browser; no token management needed in frontend

### Google OAuth Integration
- Passport strategy configured in `server/server.js` (lines 30-60)
- Callback: `/auth/google/callback` (backend handles user creation/update)
- Frontend: Link to `window.location.href = '/auth/google'` or use button

### Database (MongoDB)
- Collections: `users` (auth), `portfolios` (holdings), `adminData` (analytics)
- User object structure: `{ email, password (hashed), role, firstName, lastName, isVerified, twoFAEnabled, googleId }`
- Always use ObjectId for DB queries (e.g., `new ObjectId(id)`)

## Common Development Tasks

### Adding a New Page
1. Create page file: `Client/src/pages/NewPage.jsx`
2. Add lazy import in `App.jsx`
3. Add route: `<Route path="/new-page" element={<NewPage />} />`
4. (If protected) Wrap with `<ProtectedRoute requiredRole="...">` 

### Adding a New API Endpoint
1. Backend: Add route in `server/server.js` (e.g., `/api/user/profile`)
2. Frontend: Call via `apiClient.get('/api/user/profile')`
3. Handle errors: `error.response?.data?.message` for user feedback

### Debugging
- **Frontend:** Vite provides fast HMR; check browser DevTools Network tab for API calls
- **Backend:** `npm run dev` shows server logs; add `console.log()` or use debugger
- **Auth Issues:** Check `withCredentials: true` in Axios; verify cookies in DevTools

## File Reference Guide
- Core auth: `Client/src/context/AuthContext.jsx`, `Client/src/components/ProtectedRoute.jsx`
- Server auth: `server/server.js` (lines 80-300 for auth endpoints)
- API config: `Client/src/api/axios`
- App routing: `Client/src/App.jsx`
- Layout wrapper: `Client/src/components/layout/Layout.jsx`
