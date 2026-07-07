import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const WEEKDAY_LABELS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export default async function PlansPage() {
  const supabase = await createClient();
  const { data: routines } = await supabase
    .from("routines")
    .select("id, name, weekdays, routine_exercises(id)")
    .order("created_at", { ascending: true });

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-extrabold tracking-tight">plans</h1>
        <Button
          render={<Link href="/plans/new" />}
          nativeButton={false}
          className="rounded-lg"
        >
          new plan
        </Button>
      </div>

      {routines?.length === 0 && (
        <p className="text-sm text-muted-foreground">
          no plans yet. create one to get started.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {routines?.map((routine) => (
          <Link key={routine.id} href={`/plans/${routine.id}`}>
            <Card className="flex flex-row items-center justify-between rounded-2xl p-5">
              <div>
                <p className="text-lg font-bold">{routine.name}</p>
                <p className="text-sm text-muted-foreground">
                  {routine.weekdays.map((d) => WEEKDAY_LABELS[d]).join(", ") ||
                    "no days set"}
                  {" · "}
                  {routine.routine_exercises.length} exercises
                </p>
              </div>
              <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
