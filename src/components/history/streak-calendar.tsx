import Link from "next/link";
import { toDateString, WEEKDAY_LABELS } from "@/lib/date";
import { cn } from "@/lib/utils";

export function StreakCalendar({
  today,
  activeDates,
  days: dayCount = 30,
  label = "last month",
}: {
  today: Date;
  activeDates: Set<string>;
  days?: number;
  label?: string;
}) {
  const days: Date[] = [];
  for (let i = dayCount - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d);
  }

  // pad the front of the grid so columns line up under S M T W T F S,
  // matching whatever weekday the window happens to start on.
  const leadingBlanks = Array.from({ length: days[0].getDay() });

  const activeCount = days.filter((d) => activeDates.has(toDateString(d))).length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <p className="font-semibold">{label}</p>
        <p className="text-sm text-muted-foreground">{activeCount} active days</p>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground">
        {WEEKDAY_LABELS.map((weekdayLabel, i) => (
          <span key={i}>{weekdayLabel}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {leadingBlanks.map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {days.map((d) => {
          const dateString = toDateString(d);
          const isActive = activeDates.has(dateString);
          const isToday = dateString === toDateString(today);

          const cell = (
            <div
              className={cn(
                "flex aspect-square items-center justify-center rounded-lg border text-sm font-medium",
                isActive
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "border-border text-foreground",
                isToday && !isActive && "border-2 border-foreground"
              )}
            >
              {d.getDate()}
            </div>
          );

          return (
            <div key={dateString}>
              {isActive ? <Link href={`/history/${dateString}`}>{cell}</Link> : cell}
            </div>
          );
        })}
      </div>
    </div>
  );
}
