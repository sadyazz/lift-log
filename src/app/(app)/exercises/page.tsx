import { createClient } from "@/lib/supabase/server";
import { MUSCLE_GROUPS, muscleGroupLabel } from "@/lib/muscle-groups";
import { AddExerciseLibraryDrawer } from "@/components/exercises/add-exercise-library-drawer";
import { EditExerciseDrawer } from "@/components/exercises/edit-exercise-drawer";
import { DeleteExerciseButton } from "@/components/exercises/delete-exercise-button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const UNCATEGORIZED = "uncategorized";

export default async function ExercisesPage() {
  const supabase = await createClient();

  const [{ data: exercises }, { data: history }] = await Promise.all([
    supabase
      .from("exercises")
      .select("id, name, muscle_group, equipment")
      .order("name", { ascending: true }),
    supabase
      .from("workout_exercises")
      .select("exercise_id, workouts!inner(date, status), workout_sets(weight, is_warmup)")
      .eq("workouts.status", "completed"),
  ]);

  const setsByExercise = new Map<string, { date: string; weight: number }[]>();
  for (const row of history ?? []) {
    const date = row.workouts?.date;
    if (!date) continue;
    for (const set of row.workout_sets) {
      if (set.is_warmup || set.weight == null) continue;
      const list = setsByExercise.get(row.exercise_id) ?? [];
      list.push({ date, weight: set.weight });
      setsByExercise.set(row.exercise_id, list);
    }
  }

  const statsByExercise = new Map<string, { maxWeight: number; lastIncreaseDate: string }>();
  for (const [exerciseId, sets] of setsByExercise) {
    const sorted = [...sets].sort((a, b) => a.date.localeCompare(b.date));
    let maxWeight: number | null = null;
    let lastIncreaseDate: string | null = null;
    for (const s of sorted) {
      if (maxWeight === null || s.weight > maxWeight) {
        maxWeight = s.weight;
        lastIncreaseDate = s.date;
      }
    }
    if (maxWeight !== null && lastIncreaseDate !== null) {
      statsByExercise.set(exerciseId, { maxWeight, lastIncreaseDate });
    }
  }

  const exercisesByCategory = new Map<string, typeof exercises>();
  for (const ex of exercises ?? []) {
    const category = ex.muscle_group ?? UNCATEGORIZED;
    const list = exercisesByCategory.get(category) ?? [];
    list.push(ex);
    exercisesByCategory.set(category, list);
  }

  const categoryOrder = [...MUSCLE_GROUPS.map((g) => g.value), UNCATEGORIZED];
  const orderedCategories = categoryOrder.filter((category) =>
    exercisesByCategory.has(category)
  );

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-extrabold tracking-tight">exercises</h1>
        <AddExerciseLibraryDrawer />
      </div>

      {exercises?.length === 0 && (
        <p className="text-sm text-muted-foreground">
          no exercises yet. add one to get started.
        </p>
      )}

      {orderedCategories.length > 0 && (
        <div className="rounded-2xl border border-border px-4">
          <Accordion>
            {orderedCategories.map((category) => {
              const categoryExercises = exercisesByCategory.get(category)!;
              return (
                <AccordionItem key={category} value={category}>
                  <AccordionTrigger className="py-4">
                    <div className="flex flex-1 items-center justify-between gap-2 pr-2">
                      <span className="text-lg font-semibold">
                        {category === UNCATEGORIZED ? "uncategorized" : muscleGroupLabel(category)}
                      </span>
                      <span className="text-base text-muted-foreground">
                        {categoryExercises.length}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="border-l border-border pl-3">
                      <Accordion>
                        {categoryExercises.map((ex) => {
                          const stats = statsByExercise.get(ex.id);
                          return (
                            <AccordionItem key={ex.id} value={ex.id}>
                              <AccordionTrigger className="py-3.5">
                                <div className="flex flex-1 items-center justify-between gap-2 pr-2">
                                  <span className="text-lg font-semibold">{ex.name}</span>
                                  <span className="text-base text-muted-foreground">
                                    {stats ? `${stats.maxWeight} kg` : "-"}
                                  </span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="flex flex-col gap-4">
                                  <div className="flex items-center rounded-2xl border border-border py-4">
                                    <div className="flex flex-1 flex-col items-center gap-1">
                                      <p className="text-2xl font-extrabold">
                                        {stats?.maxWeight ?? "-"}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        max weight (kg)
                                      </p>
                                    </div>
                                    <div className="h-10 w-px bg-border" />
                                    <div className="flex flex-1 flex-col items-center gap-1">
                                      <p className="text-2xl font-extrabold">
                                        {stats?.lastIncreaseDate ?? "-"}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        last increased
                                      </p>
                                    </div>
                                  </div>
                                  {ex.equipment && (
                                    <p className="text-sm text-muted-foreground">
                                      equipment: {ex.equipment}
                                    </p>
                                  )}
                                  <div className="flex gap-2">
                                    <EditExerciseDrawer exercise={ex} />
                                    <DeleteExerciseButton exerciseId={ex.id} />
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          );
                        })}
                      </Accordion>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      )}
    </div>
  );
}
