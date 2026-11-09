# NUTRIFY AI — Smart Meal Planning & Nutrition Platform

A full-stack MERN application for meal planning, nutrition tracking, recipes, pantry inventory and grocery lists, with an optional OpenAI-powered recipe assistant.

## Stack
- Frontend: React 18, Vite, TypeScript, Tailwind CSS, React Router, Recharts, Lucide
- Backend: Node.js, Express, MongoDB/Mongoose
- Security: bcrypt password hashing, JWT access tokens, HttpOnly refresh-cookie sessions, Helmet, rate limiting, Zod validation
- AI: OpenAI API (optional; core app works without it)

## Requirements
- Node.js 20+
- MongoDB Atlas connection string or local MongoDB
- npm

## Run locally

### 1. Configure backend
```bash
cd server
cp .env.example .env
npm install
npm run dev
```
Set `MONGODB_URI` and `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` in `server/.env`.
Backend runs at http://localhost:5000.

### 2. Configure frontend (new terminal)
```bash
cd client
cp .env.example .env
npm install
npm run dev
```
Open http://localhost:5173.

### 3. Demo account
Register a new account from the sign-up screen. The app creates a starter profile and sample-friendly empty states. You can also load sample recipes from the Recipes page.

## Optional AI
Set `OPENAI_API_KEY` in `server/.env` and optionally `OPENAI_MODEL` (default `gpt-4o-mini`). Without a key, the AI endpoint returns a helpful local fallback recipe plan so the application remains usable.

## Environment variables
See `server/.env.example` and `client/.env.example`. Never commit real `.env` files.

## Main functionality
- Registration, login, logout, refresh token rotation, current-user endpoint
- Profile and nutrition goals
- Dashboard summary and trends
- Recipe catalogue, search, filters, recipe creation and favorites
- Meal plans by date and meal slot; add and remove meals
- Food diary entries and daily macro totals
- Pantry inventory CRUD
- Grocery list generation from planned meals
- Hydration logging
- AI recipe suggestions (optional provider integration)
- API health endpoint

## API overview
All API routes are prefixed with `/api`.

| Method | Route | Purpose |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Login |
| POST | `/auth/refresh` | Rotate refresh token |
| POST | `/auth/logout` | Revoke refresh session |
| GET | `/auth/me` | Current user |
| GET/PATCH | `/users/profile` | Profile |
| GET | `/dashboard` | Dashboard summary |
| GET/POST | `/recipes` | List/create recipes |
| GET/PATCH/DELETE | `/recipes/:id` | Recipe operations |
| POST | `/recipes/:id/favorite` | Toggle favorite |
| GET/POST/DELETE | `/meals` | Meal plan entries |
| GET/POST/DELETE | `/diary` | Food diary |
| GET/POST/PATCH/DELETE | `/pantry` | Pantry inventory |
| GET/POST/PATCH | `/groceries` | Grocery lists/items |
| GET/POST | `/water` | Hydration logs |
| POST | `/ai/recipe` | AI recipe suggestion |

## Deployment notes
- Deploy `server` to Render/Railway/Fly.io and provision MongoDB Atlas.
- Set production environment variables in the hosting dashboard.
- Deploy `client` to Vercel/Netlify with `VITE_API_URL` pointing to the backend URL plus `/api`.
- Set backend `CLIENT_ORIGIN` to the deployed frontend origin.
- Set `NODE_ENV=production`, strong random JWT secrets, and `COOKIE_SECURE=true`.
- Configure HTTPS on both services. Do not expose API keys in frontend variables.

## Production hardening checklist
Before public launch: configure email verification/password reset provider, add transactional email, set up monitoring/error reporting, review privacy policy and terms, test rate limits, configure backups, and validate all nutrition values against trusted food data. AI-generated nutritional estimates are suggestions, not medical advice.

## Project structure
```text
nutrify-ai/
  client/
    src/
      components/
      pages/
      App.tsx
      api.ts
      index.css
      main.tsx
  server/
    src/
      config/
      middleware/
      models/
      routes/
      utils/
      app.js
      server.js
```
