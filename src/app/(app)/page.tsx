import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StreakCalendar } from "@/components/home/streak-calendar";
import { startWorkout } from "./actions";
import { logout } from "@/app/logout/actions";
import { toDateString } from "@/lib/date";

export default async function HomePage() {
  const supabase = await createClient();
  const today = new Date();
  const todayString = toDateString(today);
  const todayWeekday = today.getDay();

  const { data: todaysRoutines } = await supabase
    .from("routines")
    .select("id, name, routine_exercises(id)")
    .contains("weekdays", [todayWeekday]);

  const { data: todaysWorkout } = await supabase
    .from("workouts")
    .select("id")
    .eq("date", todayString)
    .maybeSingle();

  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(today.getDate() - 13);

  const { data: recentWorkouts } = await supabase
    .from("workouts")
    .select("date")
    .gte("date", toDateString(twoWeeksAgo))
    .lte("date", todayString);

  const activeDates = new Set(recentWorkouts?.map((w) => w.date) ?? []);

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">today</h1>
        <form action={logout}>
          <Button type="submit" variant="ghost" size="sm">
            log out
          </Button>
        </form>
      </div>

      {todaysWorkout ? (
        <Card className="flex flex-col gap-2 p-4">
          <p className="font-semibold">workout in progress</p>
          <Button
            render={<Link href={`/workout/${todaysWorkout.id}`} />}
            nativeButton={false}
          >
            continue workout
          </Button>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {todaysRoutines && todaysRoutines.length > 0 ? (
            todaysRoutines.map((routine) => (
              <Card key={routine.id} className="flex flex-col gap-2 p-4">
                <p className="font-semibold">{routine.name}</p>
                <p className="text-sm text-muted-foreground">
                  {routine.routine_exercises.length} exercises
                </p>
                <form action={startWorkout}>
                  <input type="hidden" name="routineId" value={routine.id} />
                  <Button type="submit">start workout</Button>
                </form>
              </Card>
            ))
          ) : (
            <Card className="flex flex-col gap-2 p-4">
              <p className="text-sm text-muted-foreground">
                no plan scheduled for today
              </p>
              <form action={startWorkout}>
                <Button type="submit" variant="outline">
                  start ad-hoc workout
                </Button>
              </form>
            </Card>
          )}
        </div>
      )}

      <StreakCalendar today={today} activeDates={activeDates} />
    </div>
  );
}
