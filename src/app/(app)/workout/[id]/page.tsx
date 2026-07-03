import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function WorkoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: workout } = await supabase
    .from("workouts")
    .select("id, date, status, routines(name)")
    .eq("id", id)
    .single();

  if (!workout) {
    notFound();
  }

  const { data: workoutExercises } = await supabase
    .from("workout_exercises")
    .select("id, exercises(name)")
    .eq("workout_id", id)
    .order("position", { ascending: true });

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold">{workout.routines?.name ?? "workout"}</h1>
      <p className="text-sm text-muted-foreground">{workout.date}</p>

      <div className="flex flex-col gap-2">
        {workoutExercises?.map((we) => (
          <div key={we.id} className="rounded-lg border border-border p-3">
            {we.exercises?.name}
          </div>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        set logging is coming in the next feature.
      </p>
    </div>
  );
}
