# Pujo Mana PujoPath — Your Smart Durga Puja Travel Guide

> **Official Website Name:** Pujo Mana PujoPath  
> **Tagline:** Celebrate Maa Durga. Explore Kolkata. Get Stuck Less.  
> **Jurisdiction:** Kolkata, West Bengal  

---

## 🏛️ Overview

**Pujo Mana PujoPath** is a comprehensive Durga Puja travel guide and public transit navigation application for Kolkata, West Bengal. It upgrades the traditional festival journey into an intelligent, interactive digital companion.

The platform extracts, translates, and unifies transit records from three official Bengali festival guide documents:
1. `NORTH_KOLKATA.pdf`
2. `SOUTH_KOLKATA.pdf`
3. `CENTRAL _KOLKATA.pdf`

It translates Bengali pandal names, neighborhood clusters, and public transit connections into English while preserving the original Bengali script and source page citations. The app features an embedded interactive Leaflet map, a smart multi-stop route planner with distance/time estimation, real-time verified traffic alerts, and full public transport schedules.

---

## ✨ Key Features

### 1. Animated Maa Durga Hero & Cultural Heritage
- **Interactive Maa Durga Animated Artwork:** Gleaming golden Trishul (trident), glowing aureole/halo, divine Trinayan third eye, and floating animated Diya lamps.
- **Howrah Bridge Heritage Section:** Visual cantilever bridge over the river Hooghly with animated rippling water, flowing river reflections, and a moving ferry boat connecting Howrah & Sealdah railway travelers to Kolkata's pandal circuits.

### 2. Regional Explorer (North, South, and Central Kolkata)
- Prominent homepage section titled **"Explore Durga Puja Across Kolkata"**.
- Four interactive area cards:
  - **North Kolkata:** Bagbazar, Kumartuli, Sovabazar, Hatibagan, Maniktala, Ultadanga, Dum Dum Park, Sreebhumi.
  - **South Kolkata:** Gariahat, Ballygunge, Deshapriya Park, Kalighat, Chetla, New Alipore, Naktala, Behala.
  - **Central Kolkata:** College Square, Mohammad Ali Park, Santosh Mitra Square (Lebutala), Sealdah, Bowbazar, Janbazar.
  - **All Kolkata:** Unified city-wide directory.
- Dynamic filtering across map markers, search results, and transit tables without full-page reloads.

### 3. Embedded Interactive Leaflet Map
- **OpenStreetMap-powered Leaflet Engine:** No external Google Maps dependency required.
- **Color-Coded Custom SVG Marker Pins:**
  - 🔴 **North Kolkata:** Crimson Red
  - 🟣 **South Kolkata:** Magenta / Maroon
  - 🟡 **Central Kolkata:** Amber Gold
  - 🟢 **Your Origin / Hub:** Emerald Green
- **Real Coordinates:** 100% of pandals resolved to verified physical coordinates.
- **Map Controls:** Zoom, pan/drag, search by pandal name, neighborhood filter, GPS "Use My Location", start-point selector, and "Reset Map & Filters".
- **Dynamic Polyline Route Drawing:** Draws illuminated route lines with calculated travel distances and journey durations.

### 4. Smart Puja Route Planner ("Plan My Puja Night")
- Select starting point (Howrah, Sealdah, Esplanade, Shyambazar, Gariahat, Airport, or current GPS location).
- Multi-stop itinerary builder: add, remove, and reorder stops with ease.
- Routing modes: **Walking Circuit** vs. **Public Transit / Road**.
- **Optimize Visiting Order:** Traveling Salesperson Problem (TSP) nearest-neighbor algorithm to minimize travel distance and avoid backtracking.
- **Controls:** Plan My Route, Optimize Visiting Order, Show Route on Map, Save Itinerary (LocalStorage), Share Itinerary (clipboard), Download & Print Itinerary.

### 5. Bus Routes & Public Transport Guide
- Catalogs 60+ bus routes across Private buses, Mini buses, Government (WBTC/CSTC) buses, and AC Express buses.
- Search filters: Region, Neighborhood, Bus Type, Route Number, Metro Station, Railway Station.
- **Verified Timetables & Transparent Disclaimers:**
  - Where official WBTC schedules exist: displays first service, last service, frequency, and operating days.
  - Where departure schedules are unverified: explicitly displays:
    > *“Bus route listed in the provided guide. Exact timetable not available.”*
  - Where live tracking is unverified: explicitly displays:
    > *“Live bus tracking unavailable.”*
  - Strictly zero synthetic or fabricated departure countdowns.

### 6. Travel Smarter This Puja (Traffic, Crowd & Diversions)
- Verified Kolkata Police traffic alerts and road closures (e.g. Rashbehari Avenue pedestrian-only corridor, C.R. Avenue flow adjustments, VIP Road Sreebhumi service lane restrictions).
- Published crowd advisories and suggested visiting hours (avoiding peak 7 PM – 1 AM congestion).
- Alternative pandal recommendations nearby to avoid extreme queues.
- Clear status badges: `Live Verified`, `Official Published`, `Historical / Estimated`, `Demo Data`.

### 7. Downloadable Translated Guides & Open Datasets
- Downloadable English source guides:
  - `public/guides/NORTH_KOLKATA_GUIDE_EN.md`
  - `public/guides/SOUTH_KOLKATA_GUIDE_EN.md`
  - `public/guides/CENTRAL_KOLKATA_GUIDE_EN.md`
- Standalone structured JSON datasets:
  - `public/data/north_kolkata_pandals.json`
  - `public/data/south_kolkata_pandals.json`
  - `public/data/central_kolkata_pandals.json`
  - `public/data/transport_routes.json`
  - `public/data/traffic_advisories.json`

---

## 🛠️ Tech Stack & Setup Instructions

### Prerequisites
- **Node.js** (v18.0.0 or higher, tested on v24.14.1)
- **npm** (v9.0.0 or higher)
- **Python** (v3.10+ for data generation scripts)

### Installation

1. Navigate to the project directory:
   ```powershell
   cd "C:\Users\ARUSHI PRAJAPATI\.gemini\antigravity\scratch\pujo-mana-pujopath"
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Copy the environment configuration:
   ```powershell
   cp .env.example .env
   ```

4. Run the development server:
   ```powershell
   npm run dev
   ```
   Open `http://localhost:3000` in your web browser.

5. Build for production:
   ```powershell
   npm run build
   ```

6. Preview the production build:
   ```powershell
   npm run preview
   ```

---

## 📂 Project Structure

```
pujo-mana-pujopath/
├── public/
│   ├── data/                         # Public downloadable JSON datasets
│   │   ├── north_kolkata_pandals.json
│   │   ├── south_kolkata_pandals.json
│   │   ├── central_kolkata_pandals.json
│   │   ├── transport_routes.json
│   │   └── traffic_advisories.json
│   ├── guides/                       # Downloadable English markdown guides
│   │   ├── NORTH_KOLKATA_GUIDE_EN.md
│   │   ├── SOUTH_KOLKATA_GUIDE_EN.md
│   │   └── CENTRAL_KOLKATA_GUIDE_EN.md
│   └── favicon.svg                   # Festive SVG favicon
├── src/
│   ├── components/
│   │   ├── Navbar.jsx                # Official branding, audio chime, quick links
│   │   ├── HeroDurga.jsx             # Animated Maa Durga deity artwork & CTAs
│   │   ├── HowrahBridgeSection.jsx   # Howrah bridge, river Hooghly, ferry animation
│   │   ├── RegionSelector.jsx        # North, South, Central, All Kolkata cards
│   │   ├── InteractiveMap.jsx        # Embedded Leaflet map with routing & search
│   │   ├── PandalDirectory.jsx       # Filterable pandal catalog with Bengali names
│   │   ├── PandalDetailModal.jsx     # Detailed pandal & bus timetable modal
│   │   ├── RoutePlanner.jsx          # "Plan My Puja Night" smart route optimizer
│   │   ├── TransportGuide.jsx        # Master bus corridors & Metro schedule guide
│   │   ├── TravelSmarter.jsx         # Kolkata Police traffic alerts & crowd advisory
│   │   ├── GuideDownloadsModal.jsx   # In-app translated source guide reader
│   │   ├── Footer.jsx                # Official brand footer & emergency helplines
│   │   └── LoadingScreen.jsx         # Festive conch/diya splash screen
│   ├── data/                         # Bundled JSON datasets
│   ├── App.jsx                       # Main application state & coordinator
│   ├── index.css                     # Tailwind CSS & festive theme overrides
│   └── main.jsx                      # React 18 DOM mount
├── DATA_SUMMARY.md                   # Comprehensive data extraction & validation report
├── .env.example                      # Environment variables template
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🛡️ Data Validation & Integrity Summary

See [`DATA_SUMMARY.md`](file:///DATA_SUMMARY.md) for full audit details.
- **Pandal Names:** Original Bengali spelling alongside verified English transliteration.
- **Coordinates:** Real geographical coordinates verified via OpenStreetMap geocoding.
- **Timetable Policy:** Unverified routes carry the explicit mandatory notice: *"Bus route listed in the provided guide. Exact timetable not available."*
- **Live Telemetry Policy:** Explicitly displays *"Live bus tracking unavailable."* where real-time GPS feeds do not exist.
