-- 0001_init.sql
-- Core schema for lift-log: exercises, routines (training-day templates),
-- and workouts (actual logged sessions).

-- 1. EXERCISES ---------------------------------------------------------
create table exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  muscle_group text,
  equipment text,
  created_at timestamptz not null default now()
);

create index exercises_user_id_idx on exercises (user_id);

-- 2. ROUTINES -----------------------------------------------------------
create table routines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  weekdays smallint[] not null default '{}',
  created_at timestamptz not null default now()
);

create index routines_user_id_idx on routines (user_id);

-- 3. ROUTINE_EXERCISES ----------------------------------------------------
create table routine_exercises (
  id uuid primary key default gen_random_uuid(),
  routine_id uuid not null references routines (id) on delete cascade,
  exercise_id uuid not null references exercises (id),
  position int not null,
  target_sets int,
  target_reps int,
  created_at timestamptz not null default now()
);

create index routine_exercises_routine_id_idx on routine_exercises (routine_id);
create index routine_exercises_exercise_id_idx on routine_exercises (exercise_id);

-- 4. WORKOUTS -------------------------------------------------------------
create table workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  routine_id uuid references routines (id) on delete set null,
  date date not null,
  status text not null default 'in_progress' check (status in ('in_progress', 'completed')),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create index workouts_user_id_date_idx on workouts (user_id, date);

-- 5. WORKOUT_EXERCISES ----------------------------------------------------
create table workout_exercises (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid not null references workouts (id) on delete cascade,
  exercise_id uuid not null references exercises (id),
  position int not null,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create index workout_exercises_workout_id_idx on workout_exercises (workout_id);
create index workout_exercises_exercise_id_idx on workout_exercises (exercise_id);

-- 6. WORKOUT_SETS ----------------------------------------------------------
create table workout_sets (
  id uuid primary key default gen_random_uuid(),
  workout_exercise_id uuid not null references workout_exercises (id) on delete cascade,
  set_number int not null,
  weight numeric(6, 2),
  reps int,
  is_warmup boolean not null default false,
  created_at timestamptz not null default now()
);

create index workout_sets_workout_exercise_id_idx on workout_sets (workout_exercise_id);

-- ROW LEVEL SECURITY --------------------------------------------------------

alter table exercises enable row level security;
alter table routines enable row level security;
alter table routine_exercises enable row level security;
alter table workouts enable row level security;
alter table workout_exercises enable row level security;
alter table workout_sets enable row level security;

create policy "own exercises" on exercises
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own routines" on routines
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own workouts" on workouts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own routine_exercises" on routine_exercises
  for all using (
    exists (select 1 from routines r where r.id = routine_id and r.user_id = auth.uid())
  ) with check (
    exists (select 1 from routines r where r.id = routine_id and r.user_id = auth.uid())
  );

create policy "own workout_exercises" on workout_exercises
  for all using (
    exists (select 1 from workouts w where w.id = workout_id and w.user_id = auth.uid())
  ) with check (
    exists (select 1 from workouts w where w.id = workout_id and w.user_id = auth.uid())
  );

create policy "own workout_sets" on workout_sets
  for all using (
    exists (
      select 1 from workout_exercises we
      join workouts w on w.id = we.workout_id
      where we.id = workout_exercise_id and w.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from workout_exercises we
      join workouts w on w.id = we.workout_id
      where we.id = workout_exercise_id and w.user_id = auth.uid()
    )
  );

-- GRANTS --------------------------------------------------------------------
-- Table-level access for logged-in users only (nothing granted to "anon").
-- RLS policies above then further restrict each user to their own rows.

grant usage on schema public to authenticated;

grant select, insert, update, delete on
  exercises, routines, routine_exercises,
  workouts, workout_exercises, workout_sets
to authenticated;
