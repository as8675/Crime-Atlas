# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**CrimeAtlas** — a MERN-stack web app for exploring LAPD crime data (2020–present, ~1M records) via geospatial search, keyword search, and community annotations with Google Street View imagery.

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
- **Backend**: Node.js + Express on port 5001
- **Database**: MongoDB (Mongoose), with a **geospatial 2dsphere index** on CrimeRate.location
- **Frontend**: React 19 (create-react-app), Material-UI, Leaflet maps, react-router-dom
- **External APIs**: Google Geocoding API (address → coordinates), Google Street View Static API

### Backend Route Modules

`backend/server/server.js` is the entry point — it mounts three route modules:

| File | Routes |
|------|--------|
| `login.js` | `POST /register`, `POST /login` (bcrypt password hashing) |
| `search_with_parameters.js` | `GET /get_details`, `GET /get_crime_data` (date + crime type filter) |
| `advance_search_geospatial.js` | `GET /get_crime_data_by_location` (address → geocode → `$geoNear`), `GET /get_crime_data_at_coordinates`, `POST /add_comment`, `GET /search_crime_by_keyword`, `GET /get_crime_data_at_coordinates_with_keyword` |
| `image_retrieve.js` | `GET /get-or-create-image` (fetch from GridFS or call Street View API then store), `GET /images/:filename` |

### Frontend Structure

`App.js` manages a `UserContext` (auth state persisted to `localStorage`) and renders `Login` or `Dashboard`. `Dashboard.js` is a tabbed shell with four panels:

1. **SearchCrimeData** — filter by date range + crime description; results on a Leaflet map
2. **AdvanceSearch** — enter an address or click map to search by radius; shows Street View images and a comment thread per location
3. **KeywordSearch** — full-text keyword search on crime descriptions with pagination
4. **About** — data glossary and feature documentation

`constants.js` holds the backend base URL (`http://localhost:5001`).

### Data Models

- **CrimeRate** — crime incident records; `location` is a GeoJSON `Point` with a `2dsphere` index; raw fields mirror the LAPD CSV columns
- **User** — `{ name, email (unique), phoneNumber, password (hashed) }`
- **Comment** — `{ longitude, latitude, text, user, createdAt }`
- **GridFS** (`images` bucket) — Street View JPEG images keyed by `lat_lon` filename pattern; `image_retrieve.js` checks GridFS before calling the external API

### Environment Variables (`.env`)

```
MONGO_URI=mongodb://UserAdmin:student@127.0.0.1:27017/ProjectTest?authSource=admin
PORT=5001
GOOGLE_API_KEY=<key>
```

The Google API key is used by both `advance_search_geospatial.js` (Geocoding) and `image_retrieve.js` (Street View).
