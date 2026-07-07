import { notFound } from "next/navigation";
import { Flame } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default async function HistoryDatePage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const supabase = await createClient();

  const { data: workout } = await supabase
    .from("workouts")
    .select("id, date, routines(name)")
    .eq("date", date)
    .maybeSingle();

  if (!workout) {
    notFound();
  }

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

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">
          {workout.routines?.name ?? "workout"}
        </h1>
        <p className="text-sm text-muted-foreground">{workout.date}</p>
        {exerciseNames && (
          <p className="mt-1 text-sm text-muted-foreground">{exerciseNames}</p>
        )}
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
  );
}
