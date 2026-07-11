import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { AddWorkoutExerciseDrawer } from "@/components/workout/add-workout-exercise-drawer";
import { finishWorkout } from "./actions";

export default async function WorkoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: workout }, { data: workoutExercises }] = await Promise.all([
    supabase
      .from("workouts")
      .select("id, date, status, routines(name)")
      .eq("id", id)
      .single(),
    supabase
      .from("workout_exercises")
      .select("id, exercises(id, name), workout_sets(id, reps)")
      .eq("workout_id", id)
      .order("position", { ascending: true }),
  ]);

  if (!workout) {
    notFound();
  }

  const exercises = workoutExercises ?? [];

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            {workout.routines?.name ?? "workout"}
          </h1>
          <p className="text-sm text-muted-foreground">{workout.date}</p>
        </div>
        {workout.status === "in_progress" && (
          <form action={finishWorkout}>
            <input type="hidden" name="workoutId" value={workout.id} />
            <Button type="submit" className="rounded-lg">
              finish
            </Button>
          </form>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border">
        {exercises.map((we) => (
          <Link
            key={we.id}
            href={`/workout/${workout.id}/exercise/${we.id}`}
            className="flex items-center justify-between border-b border-border p-4"
          >
            <p className="font-semibold">{we.exercises?.name}</p>
            <p className="text-sm text-muted-foreground">
              {we.workout_sets.length} x {we.workout_sets[0]?.reps ?? "-"}
            </p>
          </Link>
        ))}
        <AddWorkoutExerciseDrawer workoutId={workout.id} />
      </div>
    </div>
  );
}
