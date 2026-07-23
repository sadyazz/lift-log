alter table exercises
  add constraint exercises_muscle_group_check
  check (
    muscle_group is null or muscle_group in (
      'quads', 'hamstrings', 'glutes', 'calves',
      'chest', 'back', 'shoulders',
      'biceps', 'triceps', 'forearms',
      'abs_core', 'cardio', 'full_body', 'other'
    )
  ) not valid;
