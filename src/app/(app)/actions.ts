"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { toDateString } from "@/lib/date";

export async function startWorkout(formData: FormData) {
  const routineId = (formData.get("routineId") as string) || null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const today = toDateString(new Date());

  const { data: workout, error } = await supabase
    .from("workouts")
    .insert({
      user_id: user.id,
      routine_id: routineId,
      date: today,
    })
    .select("id")
    .single();

  if (error || !workout) {
    throw new Error(error?.message ?? "failed to start workout");
  }

  if (routineId) {
    const { data: routineExercises } = await supabase
      .from("routine_exercises")
      .select("exercise_id, position")
      .eq("routine_id", routineId)
      .order("position", { ascending: true });

    if (routineExercises && routineExercises.length > 0) {
      const { error: seedError } = await supabase.from("workout_exercises").insert(
        routineExercises.map((re) => ({
          workout_id: workout.id,
          exercise_id: re.exercise_id,
          position: re.position,
        }))
      );

      if (seedError) {
        throw new Error(seedError.message);
      }
    }
  }

  redirect(`/workout/${workout.id}`);
}
