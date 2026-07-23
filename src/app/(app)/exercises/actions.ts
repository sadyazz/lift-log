"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createExercise(formData: FormData) {
  const name = (formData.get("name") as string).trim();
  const muscleGroup = (formData.get("muscleGroup") as string) || null;
  const equipment = (formData.get("equipment") as string)?.trim() || null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("exercises")
    .insert({ name, user_id: user.id, muscle_group: muscleGroup, equipment });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/exercises");
}

export async function updateExercise(formData: FormData) {
  const exerciseId = formData.get("exerciseId") as string;
  const name = (formData.get("name") as string).trim();
  const muscleGroup = (formData.get("muscleGroup") as string) || null;
  const equipment = (formData.get("equipment") as string)?.trim() || null;

  const supabase = await createClient();
  const { error } = await supabase
    .from("exercises")
    .update({ name, muscle_group: muscleGroup, equipment })
    .eq("id", exerciseId);

  if (error) {
    throw new Error(error.message);
  }

  refresh();
}

export async function deleteExercise(formData: FormData) {
  const exerciseId = formData.get("exerciseId") as string;

  const supabase = await createClient();
  const { error } = await supabase.from("exercises").delete().eq("id", exerciseId);

  if (error) {
    if (error.code === "23503") {
      throw new Error("can't delete — this exercise is used in a plan or workout");
    }
    throw new Error(error.message);
  }

  refresh();
}
