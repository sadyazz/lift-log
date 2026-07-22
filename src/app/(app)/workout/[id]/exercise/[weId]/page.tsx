import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SetRowMenu } from "@/components/workout/set-row-menu";
import {
  addSet,
  removeWorkoutExercise,
  updateExercise,
} from "@/app/(app)/workout/[id]/actions";

export default async function WorkoutExercisePage({
  params,
}: {
  params: Promise<{ id: string; weId: string }>;
}) {
  const { id, weId } = await params;
  const supabase = await createClient();

  const { data: workoutExercise } = await supabase
    .from("workout_exercises")
    .select(
      "id, exercises(id, name, equipment), workout_sets(id, set_number, weight, reps, is_warmup)"
    )
    .eq("id", weId)
    .eq("workout_id", id)
    .order("set_number", { ascending: true, referencedTable: "workout_sets" })
    .single();

  if (!workoutExercise) {
    notFound();
  }

  const sets = workoutExercise.workout_sets;
  const setIds = sets.map((s) => s.id).join(",");

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <Link
        href={`/workout/${id}`}
        className="flex items-center gap-1 text-sm text-muted-foreground"
      >
        <ChevronLeft className="size-4" />
        back to workout
      </Link>

      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">
          {workoutExercise.exercises?.name}
        </h1>
        {workoutExercise.exercises?.equipment && (
          <p className="text-muted-foreground">{workoutExercise.exercises.equipment}</p>
        )}
      </div>

      <form action={updateExercise.bind(null, id)} className="flex flex-col gap-3">
        <input type="hidden" name="workoutExerciseId" value={workoutExercise.id} />
        <input type="hidden" name="setIds" value={setIds} />

        <div className="flex items-center justify-between text-xs font-semibold tracking-widest text-muted-foreground">
          <span>sets</span>
          <span>{sets.length} sets</span>
        </div>

        <div className="flex flex-col divide-y divide-border">
          <div className="grid grid-cols-[2.5rem_4rem_1fr_2.5rem] items-center gap-2 pb-3 text-xs font-medium text-muted-foreground">
            <span>set</span>
            <span>kg</span>
            <span>reps</span>
            <span></span>
          </div>
          {sets.map((set, i) => (
            <div
              key={set.id}
              data-set-row={set.id}
              className="grid grid-cols-[2.5rem_4rem_1fr_2.5rem] items-center gap-2 py-5"
            >
              <span className="text-sm text-muted-foreground">{i + 1}</span>
              <Input
                key={`weight-${set.id}-${set.weight}`}
                type="number"
                inputMode="decimal"
                step="any"
                name={`weight__${set.id}`}
                defaultValue={set.weight ?? ""}
                className="h-11 w-16 border-none bg-transparent px-0 text-xl font-bold shadow-none focus-visible:ring-0"
              />
              <Input
                key={`reps-${set.id}-${set.reps}`}
                type="number"
                inputMode="numeric"
                name={`reps__${set.id}`}
                defaultValue={set.reps ?? ""}
                className="h-11 w-16 border-none bg-transparent px-0 text-xl font-bold shadow-none focus-visible:ring-0"
              />
              <SetRowMenu setId={set.id} isWarmup={set.is_warmup} />
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3 pt-2">
          <Button type="submit" formAction={addSet} variant="ghost" className="gap-1">
            <Plus className="size-4" />
            add set
          </Button>
          <Button type="submit" className="w-full rounded-lg py-6 text-base">
            save
          </Button>
        </div>

        <div className="flex items-center justify-end border-t border-border pt-4">
          <Button
            type="submit"
            formAction={removeWorkoutExercise.bind(null, id)}
            variant="ghost"
            size="sm"
            className="text-destructive"
          >
            remove exercise
          </Button>
        </div>
      </form>
    </div>
  );
}
