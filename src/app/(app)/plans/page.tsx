import Link from "next/link";
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
    <div className="mx-auto flex max-w-md flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">plans</h1>
        <Button render={<Link href="/plans/new" />} nativeButton={false}>
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
            <Card className="flex flex-row items-center justify-between p-4">
              <div>
                <p className="font-semibold">{routine.name}</p>
                <p className="text-sm text-muted-foreground">
                  {routine.weekdays.map((d) => WEEKDAY_LABELS[d]).join(", ") ||
                    "no days set"}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                {routine.routine_exercises.length} exercises
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
