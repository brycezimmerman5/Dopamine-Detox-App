# Dopamine Detox App

A neuroscience-backed **web app** for real-time urge intervention and breaking dopamine loops. Built with React, Vite, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Auth** — Sign up / Sign in with email
- **Onboarding** — Select addictions, replacement activities, future-self message
- **Home** — Streak, dopamine score, urges defeated today, Recovery Tree
- **Urge Button** — 90-second timer, breathing animation, future-self message
- **Trigger Tracking** — Log what triggered each urge + intensity (1–10)
- **Dopamine Score** — Log positive/negative actions, view daily balance
- **Analytics** — Urge history, trigger breakdown, action log
- **Recovery Tree** — Growth visual based on streak + urges defeated
- **90-day framing** — Day X of 90 journey
- **Well-being check-in** — Mental clarity, mood, energy (1–5)
- **Why this works** — 90-second rule, urge surfing, replacement behaviors

## Tech Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS
- **Backend:** Supabase (auth, database)
- **State:** Zustand
- **Routing:** React Router

## Setup

1. **Install**
   ```bash
   npm install
   ```

2. **Create Supabase project**
   - Go to [supabase.com](https://supabase.com) and create a project
   - Copy your Project URL and anon key from Settings → API

3. **Environment**
   - Create `.env` in the project root:
   ```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   ```

4. **Database schema**
   - In Supabase SQL Editor, run all migrations in order:
     1. `supabase/migrations/001_initial_schema.sql`
     2. `supabase/migrations/002_wellbeing_entries.sql`
     3. `supabase/migrations/003_reminder_preferences.sql`
     4. `supabase/migrations/004_dopamine_actions_delete.sql`

5. **Run**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
```

Output goes to `dist/`. Deploy to Vercel, Netlify, or any static host.

## Project Structure

```
src/
  components/     RecoveryTree, WellbeingCheckin
  hooks/          useOnboardingCheck
  lib/            supabase client
  screens/        Login, SignUp, Onboarding, Home, Urge, Analytics, WhyThisWorks
  store/          auth, profile, urge, streak, dopamine, wellbeing
  types/          database
supabase/
  migrations/     SQL schema
```

## Cursor Rule

The `.cursor/rules/dopamine-detox-product.mdc` rule provides product vision and architecture context for AI-assisted development.
