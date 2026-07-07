import { ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { startWorkout } from "@/app/(app)/actions";

export default async function NewWorkoutPage() {
  const supabase = await createClient();
  const { data: routines } = await supabase
    .from("routines")
    .select("id, name, routine_exercises(id)")
    .order("created_at", { ascending: true });

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <h1 className="text-4xl font-extrabold tracking-tight">start workout</h1>

      <div className="flex flex-col gap-3">
        {routines?.map((routine) => (
          <form key={routine.id} action={startWorkout}>
            <input type="hidden" name="routineId" value={routine.id} />
            <button type="submit" className="w-full text-left">
              <Card className="flex flex-row items-center justify-between rounded-2xl p-5">
                <div>
                  <p className="text-lg font-bold">{routine.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {routine.routine_exercises.length} exercises
                  </p>
                </div>
                <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
              </Card>
            </button>
          </form>
        ))}

        <form action={startWorkout}>
          <button type="submit" className="w-full text-left">
            <Card className="flex flex-row items-center justify-between rounded-2xl p-5">
              <p className="text-lg font-bold">workout without a plan</p>
              <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
            </Card>
          </button>
        </form>
      </div>
    </div>
  );
}
