# Class Farewell Titles Voting

A polished farewell voting web app for a senior-year Software Engineering class, built with React, Vite, Tailwind CSS, Supabase, React Router, and Recharts.

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template:

```bash
copy .env.example .env
```

3. Fill in these values in `.env`:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ADMIN_PASSWORD`

4. In Supabase SQL Editor, run:

- [`supabase/schema.sql`](./supabase/schema.sql)
- [`supabase/seed.sql`](./supabase/seed.sql)

5. Start the app:

```bash
npm run dev
```

## App Routes

- `/` landing page
- `/vote` voting form
- `/success` success screen
- `/admin` frontend admin password gate
- `/admin/dashboard` live analytics dashboard

## Deployment Notes

- Frontend can be deployed to Vercel, Netlify, or any static hosting that supports Vite.
- Supabase hosts the database and APIs.
- This project intentionally uses simple public policies for classroom deployment.
- For real production, replace the frontend admin password and public analytics approach with proper authentication and role-based access.
