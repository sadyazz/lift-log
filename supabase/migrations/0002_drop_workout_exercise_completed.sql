-- 0002_drop_workout_exercise_completed.sql
-- Removed: manual "mark exercise as done" checkbox. Plans and workout logs
-- are separate entities -- whether an exercise was actually done is already
-- evidenced by its logged sets, so this flag was redundant.

alter table workout_exercises drop column completed;
