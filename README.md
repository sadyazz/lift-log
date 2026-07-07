# lift-log

a minimal gym workout tracker i built for myself, to get my workouts out of the notes app and into something that actually tracks progress

## what it does

- training plans for regular days (leg day, push day, etc.), each one is just a list of exercises with target sets/reps
- start a workout from a plan, or log an ad-hoc session with whatever you end up doing
- home screen shows what's scheduled for today, plus a streak calendar
- full workout history, browsable month by month
- installable as a pwa

## built with

- next.js 16 (app router, typescript)
- tailwind css v4 + shadcn/ui
- supabase (postgres + auth, with row level security)
- deployed on vercel
