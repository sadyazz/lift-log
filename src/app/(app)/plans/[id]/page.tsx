import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addExercise, removeExercise, deleteRoutine } from "./actions";

const WEEKDAY_LABELS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: routine } = await supabase
    .from("routines")
    .select("id, name, weekdays")
    .eq("id", id)
    .single();

  if (!routine) {
    notFound();
  }

  const { data: routineExercises } = await supabase
    .from("routine_exercises")
    .select("id, target_sets, target_reps, exercises(id, name)")
    .eq("routine_id", id)
    .order("position", { ascending: true });

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{routine.name}</h1>
          <p className="text-sm text-muted-foreground">
            {routine.weekdays.map((d) => WEEKDAY_LABELS[d]).join(", ") ||
              "no days set"}
          </p>
        </div>
        <form action={deleteRoutine}>
          <input type="hidden" name="routineId" value={routine.id} />
          <Button type="submit" variant="destructive" size="sm">
            delete
          </Button>
        </form>
      </div>

      <div className="flex flex-col gap-3">
        {routineExercises?.map((re) => (
          <div
            key={re.id}
            className="flex items-center justify-between rounded-lg border border-border p-3"
          >
            <div>
              <p className="font-medium">{re.exercises?.name}</p>
              <p className="text-sm text-muted-foreground">
                {re.target_sets ?? "-"} x {re.target_reps ?? "-"}
              </p>
            </div>
            <form action={removeExercise}>
              <input type="hidden" name="routineExerciseId" value={re.id} />
              <Button type="submit" variant="ghost" size="sm">
                remove
              </Button>
            </form>
          </div>
        ))}
      </div>

      <form
        action={addExercise}
        className="flex flex-col gap-3 rounded-lg border border-border p-4"
      >
        <input type="hidden" name="routineId" value={routine.id} />
        <div className="flex flex-col gap-2">
          <Label htmlFor="exerciseName">exercise</Label>
          <Input id="exerciseName" name="exerciseName" placeholder="hip thrust" required />
        </div>
        <div className="flex gap-3">
          <div className="flex flex-1 flex-col gap-2">
            <Label htmlFor="targetSets">sets</Label>
            <Input id="targetSets" name="targetSets" type="number" min="1" />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <Label htmlFor="targetReps">reps</Label>
            <Input id="targetReps" name="targetReps" type="number" min="1" />
          </div>
        </div>
        <Button type="submit">add exercise</Button>
      </form>
    </div>
  );
}
