# PrepTrack Deployment

## Target Setup

- Frontend host: Vercel
- Backend host: Render
- Frontend root directory: `client`
- Backend root directory: `server`

## Files Added For Deployment

- Render blueprint: `render.yaml`
- Frontend env template: `client/.env.example`
- Backend env template: `server/.env.example`

## Deploy Backend To Render

### Recommended path

1. Push this repo to GitHub.
2. In Render, create a new Blueprint from the repo root.
3. Render will read `render.yaml` and create the `preptrack-api` web service from `server`.

### Required Render environment variables

- `MONGO_URI`
- `FRONTEND_URL`
- `CORS_ORIGINS`
- `GROQ_API_KEY`
- `FIREBASE_SERVICE_ACCOUNT` or `FIREBASE_SERVICE_ACCOUNT_BASE64`
- `FIREBASE_WEB_API_KEY`

### Suggested Render values

- `FRONTEND_URL=https://your-production-app.vercel.app`
- `CORS_ORIGINS=https://your-production-app.vercel.app,https://*.vercel.app`

### Render health check

- Path: `/api/health`

## Deploy Frontend To Vercel

1. In Vercel, import the same repo.
2. Set the Root Directory to `client`.
3. Vercel will use `client/vercel.json` for SPA rewrites.

### Required Vercel environment variables

- `VITE_API_URL=https://your-render-service.onrender.com`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

## Firebase Checklist

1. Enable Email/Password sign-in.
2. Add your Vercel production domain to Firebase Authentication Authorized Domains.
3. If you test on Vercel preview URLs, add each preview domain you actually use to Firebase Authentication Authorized Domains.
4. Create a Firebase service account and paste it into Render as `FIREBASE_SERVICE_ACCOUNT`.

## Order Of Operations

1. Deploy the backend to Render first.
2. Copy the Render service URL.
3. Set `VITE_API_URL` in Vercel to that Render URL.
4. Deploy the frontend to Vercel.
5. Copy the Vercel production URL.
6. Set Render `FRONTEND_URL` to that Vercel URL.
7. Set Render `CORS_ORIGINS` to `https://your-production-app.vercel.app,https://*.vercel.app`.
8. Redeploy the Render service.
9. Add the final Vercel domain to Firebase Authorized Domains.

## Verification Commands

### Frontend

- `cd client && npm run lint`
- `cd client && npm run build`

### Backend

- `node --check server/server.js`
- `cd server && npm run smoke`

## What The Smoke Test Covers

- Firebase user creation and sign-in
- Auth sync route
- Protected profile route
- Learning create, read, update, delete
- Workspace load and save
- JavaScript execution
- Python execution
- Unsupported language rejection

Optional:

- Set `SMOKE_TEST_AI=true` before `cd server && npm run smoke` to include the AI route

## Important Risk

The `/api/code/run` route executes authenticated user code on the server. It is working and tested, but it is not a hardened sandbox. For a public production app, move this feature to an isolated execution environment before exposing it broadly.
