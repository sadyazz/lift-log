import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { AddExerciseDrawer } from "@/components/plans/add-exercise-drawer";
import { removeExercise, deleteRoutine } from "./actions";
import { startWorkout } from "@/app/(app)/actions";

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: routine } = await supabase
    .from("routines")
    .select("id, name, weekdays")
    .eq("id", id)
    .single();

  if (!routine) {
    notFound();
  }

  const { data: routineExercises } = await supabase
    .from("routine_exercises")
    .select("id, target_sets, target_reps, exercises(id, name)")
    .eq("routine_id", id)
    .order("position", { ascending: true });

  const exercises = routineExercises ?? [];
  const totalSets = exercises.reduce((sum, re) => sum + (re.target_sets ?? 0), 0);
  const exerciseNames = exercises
    .map((re) => re.exercises?.name)
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 p-6 pb-32">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">{routine.name}</h1>
          {exerciseNames && (
            <p className="mt-1 text-sm text-muted-foreground">{exerciseNames}</p>
          )}
        </div>
        <form action={deleteRoutine}>
          <input type="hidden" name="routineId" value={routine.id} />
          <Button type="submit" variant="ghost" size="sm" className="text-destructive">
            delete
          </Button>
        </form>
      </div>

      <div className="flex items-center rounded-2xl border border-border py-4">
        <div className="flex flex-1 flex-col items-center gap-1">
          <p className="text-3xl font-extrabold">{totalSets}</p>
          <p className="text-xs text-muted-foreground">sets</p>
        </div>
        <div className="h-10 w-px bg-border" />
        <div className="flex flex-1 flex-col items-center gap-1">
          <p className="text-3xl font-extrabold">{exercises.length}</p>
          <p className="text-xs text-muted-foreground">exercises</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground">
          exercises
        </p>
        <div className="overflow-hidden rounded-2xl border border-border">
          {exercises.map((re) => (
            <div
              key={re.id}
              className="flex items-center justify-between border-b border-border p-4"
            >
              <div>
                <p className="font-semibold">{re.exercises?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {re.target_sets ?? "-"} x {re.target_reps ?? "-"}
                </p>
              </div>
              <form action={removeExercise}>
                <input type="hidden" name="routineExerciseId" value={re.id} />
                <Button type="submit" variant="ghost" size="sm">
                  remove
                </Button>
              </form>
            </div>
          ))}
          <AddExerciseDrawer routineId={routine.id} />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-24 z-40 mx-auto max-w-md px-6">
        <form action={startWorkout}>
          <input type="hidden" name="routineId" value={routine.id} />
          <Button type="submit" className="w-full rounded-lg py-6 text-base">
            start workout
          </Button>
        </form>
      </div>
    </div>
  );
}
