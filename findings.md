# Findings Log

- **Real-time Requirement:** The DJ (Inés) needs to see son requests immediately. Supabase is highly recommended over a standard basic database because it provides built-in real-time subscriptions over websockets, which is perfect for Next.js.
- **Status Toggle:** The requirement to move downloaded songs to the bottom and dim them means the frontend list should be sorted by `status` (pending first), then `created_at` (newest first).
- **Aesthetic:** 90s software vibe (Winamp, ICQ, Ares). We'll need a distinctive color palette based on the user's logo.
