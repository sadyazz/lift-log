export const MUSCLE_GROUPS = [
  { value: "quads", label: "quads" },
  { value: "hamstrings", label: "hamstrings" },
  { value: "glutes", label: "glutes" },
  { value: "calves", label: "calves" },
  { value: "chest", label: "chest" },
  { value: "back", label: "back" },
  { value: "shoulders", label: "shoulders" },
  { value: "biceps", label: "biceps" },
  { value: "triceps", label: "triceps" },
  { value: "forearms", label: "forearms" },
  { value: "abs_core", label: "abs / core" },
  { value: "cardio", label: "cardio" },
  { value: "full_body", label: "full body" },
  { value: "other", label: "other" },
] as const;

export function muscleGroupLabel(value: string | null) {
  return MUSCLE_GROUPS.find((g) => g.value === value)?.label ?? null;
}
