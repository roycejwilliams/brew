# BR3W

BR3W is an invite-only social platform for creating small, intentional real-world moments — and letting the right people join. No feeds, no followers, no noise.

**[br3w.app](https://br3w.app)** · **[join.br3w.app](https://join.br3w.app)**

---

## What It Does

You create a moment. You decide who sees it. Something real happens.

- **Moments** — lightweight, time-bound social experiences defined by vibe, time, place, and openness. Hosts control visibility and can close moments at any time.
- **Circles** — pre-trusted groups you manage. Add members, remove members, invite entire circles to moments.
- **Nearby Discovery** — moments with `nearby` visibility appear on the Pulse map for anyone within range. No public feeds, no algorithmic ranking.
- **Pulse** — live map view of what's happening now. Scope by distance (here, nearby, area) and time (tonight, tomorrow, this week). Mapbox markers with two-tap interaction — zoom first, then open.
- **Invites** — invite people to moments or circles via in-app flow or QR code deep links. Accept/decline with real-time notification updates.
- **Check-in** — QR code scan at the door. Host gets notified. Closed moments block check-ins.
- **AI Recap** — after a moment ends, an AI-generated 2-3 sentence cinematic recap is created and persisted. Attendees can upload photos.
- **Notifications** — email (Resend) and SMS (Twilio) for check-ins, moment reminders (1hr before), invite nudges (24hr pending), recap generation, and photo uploads. Cron-scheduled where appropriate.

---

## Tech Stack

### Frontend
- Next.js (React), TypeScript
- Tailwind CSS
- Framer Motion — opacity-only animations on mobile, layout animations on desktop
- Mapbox GL JS — Pulse map, moment markers, geocoding (city + address hooks)
- Embla Carousel — horizontal scroll components
- Zustand — client state + session persistence with `onRehydrateStorage` hydration detection
- TanStack Query — all data fetching, cache invalidation on mutations

### Backend
- Node.js, Express, TypeScript
- PostgreSQL (Supabase) with PostGIS — geospatial queries via `ST_DWithin`, `ST_MakePoint`
- JWT authentication (1-year expiry, includes `role` in payload)
- Phone OTP (Twilio) + Email OTP (Resend)
- Anthropic API — moment recap generation
- node-cron — scheduled reminder and nudge jobs
- helmet.js, tiered rate limiting, input sanitization, parameterized queries

### Infrastructure
- Frontend: Vercel
- Backend: Railway (Docker)
- Database: Supabase (PostgreSQL + PostGIS 3.6)
- Storage: Supabase Storage (`brew-image` bucket — avatars, moment photos)
- DNS: Namecheap (`br3w.app` → Vercel, `join.br3w.app` → Framer)

---

## Security

- SQL injection fixed across all dynamic update routes (parameterized key mapping)
- Ownership authorization on all user routes (`GET`/`PUT`/`DELETE /users/:id`)
- Role-based middleware (`userRole("admin")`) on application approval routes
- CORS locked to production origins + Vercel preview URL regex
- CSRF not applicable — JWT in Authorization header, not cookies
- DB indexes on all foreign keys and the PostGIS `location` column (GiST)

---

## Project Status

Private beta. Invite-only at [br3w.app](https://br3w.app). Sales page live at [join.br3w.app](https://join.br3w.app).

---

## License

Proprietary. All rights reserved.
