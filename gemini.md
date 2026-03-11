# Project Constitution: Fiesta PopUp

## 1. Identity
- **Project Name:** Fiesta PopUp: hacela tuya
- **Slogan:** "Escaneá, pedí y bailá"
- **Target Audience:** Party guests (mobile-first interaction) and the DJ (real-time management).

## 2. Architecture & Tech Stack
- **Frontend / Framework:** Next.js (React) for a smooth, app-like mobile experience.
- **Styling:** Custom CSS with a 90s retro aesthetic (Winamp, ICQ, Ares vibes), using the logo's color palette.
- **Backend / Database:** Supabase (PostgreSQL + Realtime websockets). Real-time functionality is MANDATORY so the DJ panel updates instantly without refreshing.
- **Integrations:** Spotify API (for fetching track metadata, cover art, and playable links).

## 3. Data Schema
### Song Request (Payload)
- `id`: UUID (Primary Key)
- `guest_name`: string (Optional, default "Anónimo")
- `song_name`: string (Required input from user)
- `artist_name`: string (Optional input from user)
- `dj_message`: string (Optional message for the DJ)
- `spotify_track_id`: string (Fetched via Spotify API)
- `spotify_url`: string (Link to pass to DJ)
- `cover_url`: string (Album cover)
- `status`: string ('pending' | 'downloaded')
- `created_at`: timestamp

## 4. Behavioral Rules
- **Guest App:** 
  - Must be mobile-optimized (large buttons, easy to type).
  - Clear user feedback loops (e.g., success animations like "¡Tu tema ya está a la suerte de la DJ!").
- **DJ Panel (`/ine-dj`):**
  - Protected route / simple access code.
  - Real-time updates.
  - Songs visually distinct when `status == 'downloaded'` (darkened, moved to bottom).

## 5. Deployment Delivery Payload
- **Hosting:** Vercel.
- **Domain:** fiestapopup.com.ar.
