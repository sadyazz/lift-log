import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { muscleGroupLabel } from "@/lib/muscle-groups";
import { ExerciseSetForm } from "@/components/workout/exercise-set-form";

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
      "id, exercises(id, name, equipment, muscle_group), workout_sets(id, set_number, weight, reps, is_warmup, is_failure)"
    )
    .eq("id", weId)
    .eq("workout_id", id)
    .order("set_number", { ascending: true, referencedTable: "workout_sets" })
    .single();

  if (!workoutExercise) {
    notFound();
  }

  const sets = workoutExercise.workout_sets;

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
        {(workoutExercise.exercises?.muscle_group || workoutExercise.exercises?.equipment) && (
          <p className="text-muted-foreground">
            {[
              workoutExercise.exercises.muscle_group &&
                muscleGroupLabel(workoutExercise.exercises.muscle_group),
              workoutExercise.exercises.equipment,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}
      </div>

      <ExerciseSetForm workoutId={id} workoutExerciseId={workoutExercise.id} sets={sets} />
    </div>
  );
}
