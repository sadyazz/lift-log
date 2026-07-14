import Link from "next/link";
import { notFound } from "next/navigation";
import { Flame } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { StartWorkoutPicker } from "@/components/workout/start-workout-picker";
import { toDateString } from "@/lib/date";

export default async function HistoryDatePage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;

  if (date > toDateString(new Date())) {
    notFound();
  }

  const supabase = await createClient();

  const { data: workouts } = await supabase
    .from("workouts")
    .select("id, date, routines(name)")
    .eq("date", date)
    .order("created_at", { ascending: true });

  if (!workouts || workouts.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col gap-6 p-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">add a workout</h1>
          <p className="text-sm text-muted-foreground">{date}</p>
        </div>
        <StartWorkoutPicker date={date} />
      </div>
    );
  }

  const sessions = await Promise.all(
    workouts.map(async (workout) => {
      const { data: workoutExercises } = await supabase
        .from("workout_exercises")
        .select(
          "id, exercises(id, name), workout_sets(id, set_number, weight, reps, is_warmup)"
        )
        .eq("workout_id", workout.id)
        .order("position", { ascending: true })
        .order("set_number", { ascending: true, referencedTable: "workout_sets" });

      const exercises = workoutExercises ?? [];
      const exerciseNames = exercises
        .map((we) => we.exercises?.name)
        .filter(Boolean)
        .join(" · ");

      return { workout, exercises, exerciseNames };
    })
  );

  return (
    <div className="mx-auto flex max-w-md flex-col gap-8 p-6">
      <p className="text-sm text-muted-foreground">{date}</p>

      {sessions.map(({ workout, exercises, exerciseNames }, i) => (
        <div key={workout.id} className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                {workout.routines?.name ?? "workout"}
                {sessions.length > 1 && (
                  <span className="ml-2 text-base font-normal text-muted-foreground">
                    session {i + 1}
                  </span>
                )}
              </h1>
              {exerciseNames && (
                <p className="mt-1 text-sm text-muted-foreground">{exerciseNames}</p>
              )}
            </div>
            <Button
              render={<Link href={`/workout/${workout.id}`} />}
              nativeButton={false}
              variant="outline"
              size="sm"
            >
              edit
            </Button>
          </div>

          {exercises.length === 0 ? (
            <p className="text-sm text-muted-foreground">no exercises logged</p>
          ) : (
            <div className="rounded-2xl border border-border px-4">
              <Accordion>
                {exercises.map((we) => (
                  <AccordionItem key={we.id} value={we.id}>
                    <AccordionTrigger>
                      <div className="flex flex-col items-start gap-0.5">
                        <span className="font-semibold">{we.exercises?.name}</span>
                        <span className="text-xs font-normal text-muted-foreground">
                          {we.workout_sets.length} sets
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-2">
                        {we.workout_sets.length === 0 && (
                          <p className="text-sm text-muted-foreground">no sets logged</p>
                        )}
                        {we.workout_sets.map((set, i) => (
                          <div
                            key={set.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                              set {i + 1} · {set.reps ?? "-"} reps
                              {set.is_warmup && <Flame className="size-3.5" />}
                            </span>
                            <span className="font-medium">{set.weight ?? "-"} kg</span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
