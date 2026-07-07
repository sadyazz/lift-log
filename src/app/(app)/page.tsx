import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { StreakCalendar } from "@/components/history/streak-calendar";
import { logout } from "@/app/logout/actions";
import { toDateString } from "@/lib/date";

export default async function HomePage() {
  const supabase = await createClient();
  const today = new Date();
  const todayString = toDateString(today);

  const { data: todaysWorkout } = await supabase
    .from("workouts")
    .select("id")
    .eq("date", todayString)
    .maybeSingle();

  const monthAgo = new Date(today);
  monthAgo.setDate(today.getDate() - 29);

  const { data: recentWorkouts } = await supabase
    .from("workouts")
    .select("date")
    .gte("date", toDateString(monthAgo))
    .lte("date", todayString);

  const activeDates = new Set(recentWorkouts?.map((w) => w.date) ?? []);

  return (
    <div className="mx-auto flex max-w-md flex-col gap-8 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">today</h1>
          <p className="text-sm text-muted-foreground">good to see you</p>
        </div>
        <form action={logout}>
          <Button type="submit" variant="ghost" size="sm">
            log out
          </Button>
        </form>
      </div>

      <Button
        render={
          <Link href={todaysWorkout ? `/workout/${todaysWorkout.id}` : "/workout/new"} />
        }
        nativeButton={false}
        className="w-full rounded-lg py-6 text-base"
      >
        {todaysWorkout ? "continue workout" : "start workout"}
      </Button>

      <StreakCalendar today={today} activeDates={activeDates} days={30} label="last month" />
    </div>
  );
}
