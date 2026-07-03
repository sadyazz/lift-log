"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createRoutine(formData: FormData) {
  const name = formData.get("name") as string;
  const weekdays = formData.getAll("weekdays").map(Number);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: routine, error } = await supabase
    .from("routines")
    .insert({ name, weekdays, user_id: user.id })
    .select("id")
    .single();

  if (error || !routine) {
    throw new Error(error?.message ?? "failed to create routine");
  }

  redirect(`/plans/${routine.id}`);
}
