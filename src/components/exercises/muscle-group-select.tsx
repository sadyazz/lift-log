import { MUSCLE_GROUPS } from "@/lib/muscle-groups";

export function MuscleGroupSelect({
  name = "muscleGroup",
  defaultValue = "other",
  id,
}: {
  name?: string;
  defaultValue?: string;
  id?: string;
}) {
  return (
    <select
      id={id}
      name={name}
      defaultValue={defaultValue}
      className="h-11 w-full rounded-lg border border-input bg-transparent px-2.5 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
    >
      {MUSCLE_GROUPS.map((g) => (
        <option key={g.value} value={g.value}>
          {g.label}
        </option>
      ))}
    </select>
  );
}
