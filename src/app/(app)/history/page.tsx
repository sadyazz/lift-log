import { createClient } from "@/lib/supabase/server";
import { MonthCalendar } from "@/components/history/month-calendar";
import { toDateString } from "@/lib/date";

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month: monthParam } = await searchParams;
  const supabase = await createClient();

  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;

  if (monthParam) {
    const [y, m] = monthParam.split("-").map(Number);
    if (y && m) {
      year = y;
      month = m;
    }
  }

  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0);

  const { data: workouts } = await supabase
    .from("workouts")
    .select("date")
    .gte("date", toDateString(monthStart))
    .lte("date", toDateString(monthEnd));

  const activeDates = new Set(workouts?.map((w) => w.date) ?? []);

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <h1 className="text-4xl font-extrabold tracking-tight">history</h1>
      <MonthCalendar year={year} month={month} activeDates={activeDates} />
    </div>
  );
}
