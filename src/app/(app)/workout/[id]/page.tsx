import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  finishWorkout,
  addWorkoutExercise,
  removeWorkoutExercise,
  addSet,
  removeSet,
  updateExercise,
} from "./actions";

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
    .select(
      "id, completed, exercises(id, name), workout_sets(id, set_number, weight, reps, is_warmup)"
    )
    .eq("workout_id", id)
    .order("position", { ascending: true })
    .order("set_number", { ascending: true, referencedTable: "workout_sets" });

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{workout.routines?.name ?? "workout"}</h1>
          <p className="text-sm text-muted-foreground">{workout.date}</p>
        </div>
        {workout.status === "in_progress" && (
          <form action={finishWorkout}>
            <input type="hidden" name="workoutId" value={workout.id} />
            <Button type="submit">finish</Button>
          </form>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {workoutExercises?.map((we) => {
          const setIds = we.workout_sets.map((s) => s.id).join(",");

          return (
            <Card key={we.id} className="flex flex-col gap-3 p-4">
              <form action={updateExercise} className="flex flex-col gap-3">
                <input type="hidden" name="workoutExerciseId" value={we.id} />
                <input type="hidden" name="setIds" value={setIds} />

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 font-semibold">
                    <input
                      type="checkbox"
                      name="completed"
                      defaultChecked={we.completed}
                      className="size-4"
                    />
                    {we.exercises?.name}
                  </label>
                  <Button
                    type="submit"
                    formAction={removeWorkoutExercise}
                    variant="ghost"
                    size="sm"
                  >
                    remove
                  </Button>
                </div>

                {we.workout_sets.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-[2rem_1fr_1fr_auto_auto] items-center gap-2 text-xs text-muted-foreground">
                      <span>set</span>
                      <span>kg</span>
                      <span>reps</span>
                      <span>warmup</span>
                      <span></span>
                    </div>
                    {we.workout_sets.map((set, i) => (
                      <div
                        key={set.id}
                        className="grid grid-cols-[2rem_1fr_1fr_auto_auto] items-center gap-2"
                      >
                        <span className="text-sm text-muted-foreground">{i + 1}</span>
                        <Input
                          type="number"
                          name={`weight__${set.id}`}
                          defaultValue={set.weight ?? ""}
                          className="h-8"
                        />
                        <Input
                          type="number"
                          name={`reps__${set.id}`}
                          defaultValue={set.reps ?? ""}
                          className="h-8"
                        />
                        <input
                          type="checkbox"
                          name={`warmup__${set.id}`}
                          defaultChecked={set.is_warmup}
                          className="size-4 justify-self-center"
                        />
                        <Button
                          type="submit"
                          formAction={removeSet.bind(null, set.id)}
                          variant="ghost"
                          size="icon-sm"
                        >
                          x
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button type="submit" formAction={addSet} variant="outline" size="sm">
                    add set
                  </Button>
                  <Button type="submit" size="sm">
                    save
                  </Button>
                </div>
              </form>
            </Card>
          );
        })}
      </div>

      <form
        action={addWorkoutExercise}
        className="flex flex-col gap-3 rounded-lg border border-border p-4"
      >
        <input type="hidden" name="workoutId" value={workout.id} />
        <div className="flex flex-col gap-2">
          <Label htmlFor="exerciseName">exercise</Label>
          <Input id="exerciseName" name="exerciseName" placeholder="bicep curl" required />
        </div>
        <Button type="submit">add exercise</Button>
      </form>
    </div>
  );
}
