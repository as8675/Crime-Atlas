# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**CrimeAtlas** — a MERN-stack web app for exploring LAPD crime data (2020–present, ~1M records) via geospatial search, keyword search, and community annotations with Google Street View imagery.

## Live Deployment

| Layer | URL |
|-------|-----|
| Frontend | https://crimeatlas.vercel.app |
| Backend | https://crime-atlas-backend.onrender.com |
| Database | MongoDB Atlas (Flex cluster) — `ProjectTest` database |

## Commands

### Backend
```bash
# From repo root
node backend/server/server.js
# Runs on port 5001; requires MongoDB at the MONGO_URI in .env
```

### Frontend
```bash
cd frontend/crime-app
npm install
npm start      # Dev server on port 3000
npm run build  # Production build
```

### Data Pipeline (one-time setup)
```bash
# Import crime CSV into MongoDB
node src/mongotest_data_dump.js

# Fetch and store Google Street View images into GridFS
node src/mongotest_Images_dump.js
```

### Tests
No tests are currently implemented. Both `package.json` files have placeholder test scripts.

## Architecture

### Stack
- **Backend**: Node.js + Express on port 5001, deployed on **Render**
- **Database**: MongoDB Atlas Flex (Mongoose), with a **2dsphere index** on `CrimeRate.location` — must exist for geospatial queries to work
- **Frontend**: React 19 (create-react-app), Material-UI, Leaflet maps, react-router-dom, deployed on **Vercel**
- **External APIs**: Google Geocoding API (address → coordinates), Google Street View Static API — both require billing enabled on the Google Cloud project that owns the key

### Backend Route Modules

`backend/server/server.js` is the entry point — it mounts three route modules:

| File | Routes |
|------|--------|
| `login.js` | `POST /register`, `POST /login` (bcrypt password hashing) |
| `search_with_parameters.js` | `GET /get_details`, `GET /get_crime_data` (date + crime type filter) |
| `advance_search_geospatial.js` | `GET /get_crime_data_by_location` (address → geocode → `$geoNear`), `GET /get_crime_data_at_coordinates`, `POST /add_comment`, `GET /search_crime_by_keyword`, `GET /get_crime_data_at_coordinates_with_keyword` |
| `image_retrieve.js` | `GET /get-or-create-image` (fetch from GridFS or call Street View API then store), `GET /images/:filename` |

The image fetch in `advance_search_geospatial.js` is intentionally non-blocking — Street View failures return `imageData: null` without failing the crime data response.

### Frontend Structure

`App.js` manages a `UserContext` (auth state persisted to `localStorage`) and renders `Login` or `Dashboard`. `Dashboard.js` is a tabbed shell with four panels:

1. **SearchCrimeData** — filter by date range + crime description; results on a Leaflet map
2. **AdvanceSearch** — enter an address or click map to search by radius; shows Street View images and a comment thread per location
3. **KeywordSearch** — full-text keyword search on crime descriptions with pagination
4. **About** — data glossary and feature documentation

`constants.js` holds `BASE_URL` (read from `REACT_APP_API_URL` env var, falls back to `http://localhost:5001`) and the login page logo. All API calls across components use this `BASE_URL`.

### Data Models

- **CrimeRate** — crime incident records; `location` is a GeoJSON `Point` with a `2dsphere` index; raw fields mirror the LAPD CSV columns
- **User** — `{ name, email (unique), phoneNumber, password (hashed) }`
- **Comment** — `{ longitude, latitude, text, user, createdAt }`
- **GridFS** (`images` bucket) — Street View JPEG images keyed by `lat_lon` filename pattern; `image_retrieve.js` checks GridFS before calling the external API

### Environment Variables

**Backend (`.env` at repo root, or Render environment):**
```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/ProjectTest?appName=Cluster0
PORT=5001
GOOGLE_API_KEY=<key>
FRONTEND_URL=https://crimeatlas.vercel.app
```

**Frontend (Vercel environment):**
```
REACT_APP_API_URL=https://crime-atlas-backend.onrender.com
CI=false
```

### Deployment Notes

- **Vercel** serves the frontend; `vercel.json` at repo root rewrites all routes to `index.html` for React Router
- **Render** free tier spins down after 15 min of inactivity — first request after idle takes ~30s
- The `2dsphere` index on `CrimeRate.location` in Atlas is required for Advanced Search (`$geoNear`). If it's missing, recreate it: Atlas → Collections → CrimeRate → Indexes → Create Index → `location: 2dsphere`
- Street View images require the Street View Static API enabled with billing on the same Google Cloud project as the API key
- `CI=false` is set on Vercel to prevent ESLint warnings from failing the React build
