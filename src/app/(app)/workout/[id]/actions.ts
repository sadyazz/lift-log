"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function finishWorkout(formData: FormData) {
  const workoutId = formData.get("workoutId") as string;

  const supabase = await createClient();
  const { error } = await supabase
    .from("workouts")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", workoutId);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/");
}

export async function addWorkoutExercise(formData: FormData) {
  const workoutId = formData.get("workoutId") as string;
  const exerciseName = (formData.get("exerciseName") as string).trim();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: existing } = await supabase
    .from("exercises")
    .select("id")
    .eq("user_id", user.id)
    .ilike("name", exerciseName)
    .maybeSingle();

  let exerciseId = existing?.id;

  if (!exerciseId) {
    const { data: created, error } = await supabase
      .from("exercises")
      .insert({ name: exerciseName, user_id: user.id })
      .select("id")
      .single();

    if (error || !created) {
      throw new Error(error?.message ?? "failed to create exercise");
    }

    exerciseId = created.id;
  }

  const { data: lastExercise } = await supabase
    .from("workout_exercises")
    .select("position")
    .eq("workout_id", workoutId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextPosition = (lastExercise?.position ?? -1) + 1;

  const { error: insertError } = await supabase.from("workout_exercises").insert({
    workout_id: workoutId,
    exercise_id: exerciseId,
    position: nextPosition,
  });

  if (insertError) {
    throw new Error(insertError.message);
  }

  refresh();
}

export async function removeWorkoutExercise(workoutId: string, formData: FormData) {
  const workoutExerciseId = formData.get("workoutExerciseId") as string;

  const supabase = await createClient();
  const { error } = await supabase
    .from("workout_exercises")
    .delete()
    .eq("id", workoutExerciseId);

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/workout/${workoutId}`);
}

async function saveSets(
  supabase: Awaited<ReturnType<typeof createClient>>,
  formData: FormData
) {
  const setIds = (formData.get("setIds") as string).split(",").filter(Boolean);

  for (const setId of setIds) {
    const weightValue = formData.get(`weight__${setId}`);
    const repsValue = formData.get(`reps__${setId}`);
    const isWarmup = formData.get(`warmup__${setId}`) === "on";

    const { error } = await supabase
      .from("workout_sets")
      .update({
        weight: weightValue ? Number(weightValue) : null,
        reps: repsValue ? Number(repsValue) : null,
        is_warmup: isWarmup,
      })
      .eq("id", setId);

    if (error) {
      throw new Error(error.message);
    }
  }
}

export async function addSet(formData: FormData) {
  const workoutExerciseId = formData.get("workoutExerciseId") as string;

  const supabase = await createClient();

  await saveSets(supabase, formData);

  const { data: lastSet } = await supabase
    .from("workout_sets")
    .select("set_number")
    .eq("workout_exercise_id", workoutExerciseId)
    .order("set_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextSetNumber = (lastSet?.set_number ?? 0) + 1;

  const { error } = await supabase.from("workout_sets").insert({
    workout_exercise_id: workoutExerciseId,
    set_number: nextSetNumber,
  });

  if (error) {
    throw new Error(error.message);
  }

  refresh();
}

export async function removeSet(setId: string, _formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("workout_sets").delete().eq("id", setId);

  if (error) {
    throw new Error(error.message);
  }

  refresh();
}

export async function toggleWarmupSet(
  setId: string,
  isWarmup: boolean,
  _formData: FormData
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("workout_sets")
    .update({ is_warmup: isWarmup })
    .eq("id", setId);

  if (error) {
    throw new Error(error.message);
  }

  refresh();
}

export async function updateExercise(formData: FormData) {
  const supabase = await createClient();

  await saveSets(supabase, formData);

  refresh();
}
