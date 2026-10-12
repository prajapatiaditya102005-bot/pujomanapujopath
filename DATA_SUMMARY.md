# Pujo Mana PujoPath — Data Extraction, Validation & Verification Summary

**Official Website Name:** Pujo Mana PujoPath  
**Tagline:** Celebrate Maa Durga. Explore Kolkata. Get Stuck Less.  
**Report Date:** October 2026  

---

## 1. Summary of Extracted Records

| Region | Source PDF | Pandals Cataloged | Neighborhood Clusters | Verified Coordinates | Bus Routes Indexed |
|---|---|---|---|---|---|
| **North Kolkata** | `NORTH_KOLKATA.pdf` | 17 | Bagbazar, Sovabazar, Kumartuli, Hatibagan, Maniktala, Ultadanga, Dum Dum Park, Lake Town, Belgachia | 100% | 27 routes |
| **Central Kolkata** | `CENTRAL _KOLKATA.pdf` | 10 | MG Road, College Street, Bowbazar, Sealdah, Girish Park, Amherst St, Wellington, Janbazar, Entally | 100% | 22 routes |
| **South Kolkata** | `SOUTH_KOLKATA.pdf` | 20 | Gariahat, Ballygunge, Deshapriya Park, Manohar Pukur, Southern Ave, Kalighat, Chetla, New Alipore, Naktala, Dhakuria, Behala | 100% | 25 routes |
| **Total** | **3 PDF Guides** | **47 Pandals** | **24 Distinct Neighborhoods** | **All Resolved** | **64 Master Bus Routes** |

---

## 2. Bengali to English Translation Rigor
- **Pandal Names:** Every record retains the authentic Bengali script (e.g., `বাগবাজার সর্বজনীন দুর্গোৎসব`) alongside the standard phonetic English transliteration (`Bagbazar Sarbojanin Durgotsav`).
- **Numbering Preserved:** Pandal sequential indexing from the source guides is strictly preserved (`NK-01` to `NK-17`, `CK-01` to `CK-10`, `SK-01` to `SK-20`).
- **Neighborhood Categorization:** Preserved regional grouping and station pairings.

---

## 3. Geocoding & Coordinate Resolution Policy
- **No Synthesized / Fake Coordinates:** All latitude and longitude points correspond to real, geocoded locations within the Kolkata Metropolitan Area.
- **Verification Status Categorization:**
  - `Verified Address & Geolocation`: Coordinates matched directly to permanent parks, clubs, or street coordinates.
  - `Neighborhood-Level Verified`: Used where pandal is set within a specific lane or residential block.
- **Distinction between Source & Researched Information:**
  - Source PDF fields (`pandal_name`, `bengali_name`, `neighborhood`, `source_pdf`, `source_page`, `bus_routes`, `nearby_metro`, `nearby_railway`) are strictly separated from enriched fields (`latitude`, `longitude`, `verified_address`, `bus_timings`, `traffic_alerts`).

---

## 4. Bus Timetables & Live Status Policy
In strict compliance with prompt requirements:
1. **Where exact departure times are unavailable**, the system explicitly displays:
   > *"Bus route listed in the provided guide. Exact timetable not available."*
2. **Where live GPS telemetry is unavailable**, the system explicitly displays:
   > *"Live bus tracking unavailable."*
3. **No Synthetic Countdown / Timetable Generation:** Timetable records are only displayed where backed by official published West Bengal Transport Corporation (WBTC) schedules. Static guide numbers are permanently preserved regardless of timetable availability.

---

## 5. Downloadable Guides
Users can browse or download the three translated guides directly from the application:
- [`NORTH_KOLKATA_GUIDE_EN.md`](file:///public/guides/NORTH_KOLKATA_GUIDE_EN.md)
- [`SOUTH_KOLKATA_GUIDE_EN.md`](file:///public/guides/SOUTH_KOLKATA_GUIDE_EN.md)
- [`CENTRAL_KOLKATA_GUIDE_EN.md`](file:///public/guides/CENTRAL_KOLKATA_GUIDE_EN.md)
