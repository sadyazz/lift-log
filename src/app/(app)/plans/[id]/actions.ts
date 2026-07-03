"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function addExercise(formData: FormData) {
  const routineId = formData.get("routineId") as string;
  const exerciseName = (formData.get("exerciseName") as string).trim();
  const targetSets = formData.get("targetSets")
    ? Number(formData.get("targetSets"))
    : null;
  const targetReps = formData.get("targetReps")
    ? Number(formData.get("targetReps"))
    : null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // reuse an existing exercise with this name, or create a new one.
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
    .from("routine_exercises")
    .select("position")
    .eq("routine_id", routineId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextPosition = (lastExercise?.position ?? -1) + 1;

  const { error: insertError } = await supabase.from("routine_exercises").insert({
    routine_id: routineId,
    exercise_id: exerciseId,
    position: nextPosition,
    target_sets: targetSets,
    target_reps: targetReps,
  });

  if (insertError) {
    throw new Error(insertError.message);
  }
}

export async function removeExercise(formData: FormData) {
  const routineExerciseId = formData.get("routineExerciseId") as string;

  const supabase = await createClient();
  const { error } = await supabase
    .from("routine_exercises")
    .delete()
    .eq("id", routineExerciseId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteRoutine(formData: FormData) {
  const routineId = formData.get("routineId") as string;

  const supabase = await createClient();
  const { error } = await supabase.from("routines").delete().eq("id", routineId);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/plans");
}
