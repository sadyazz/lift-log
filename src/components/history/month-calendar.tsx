import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toDateString, WEEKDAY_LABELS } from "@/lib/date";
import { cn } from "@/lib/utils";

const MONTH_NAMES = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

function monthParam(year: number, month: number) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function MonthCalendar({
  year,
  month,
  activeDates,
}: {
  year: number;
  month: number; // 1-12
  activeDates: Set<string>;
}) {
  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const leadingBlanks = Array.from({ length: firstDay.getDay() });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const today = new Date();
  const todayString = toDateString(today);
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() + 1 === month;

  const prev = month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 };
  const next = month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 };
  const isNextInFuture =
    next.year > today.getFullYear() ||
    (next.year === today.getFullYear() && next.month > today.getMonth() + 1);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Link
          href={`/history?month=${monthParam(prev.year, prev.month)}`}
          className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <p className="font-semibold">
          {MONTH_NAMES[month - 1]} {year}
        </p>
        {isNextInFuture ? (
          <span className="size-8" />
        ) : (
          <Link
            href={`/history?month=${monthParam(next.year, next.month)}`}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className="size-5" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground">
        {WEEKDAY_LABELS.map((label, i) => (
          <span key={i}>{label}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {leadingBlanks.map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {days.map((day) => {
          const date = new Date(year, month - 1, day);
          const dateString = toDateString(date);
          const isActive = activeDates.has(dateString);
          const isToday = isCurrentMonth && day === today.getDate();
          const isFuture = dateString > todayString;

          const cell = (
            <div
              className={cn(
                "flex aspect-square items-center justify-center rounded-lg border text-sm font-medium",
                isActive
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "border-border text-foreground",
                isToday && !isActive && "border-2 border-foreground",
                isFuture && "opacity-40"
              )}
            >
              {day}
            </div>
          );

          return (
            <div key={dateString}>
              {isFuture ? cell : <Link href={`/history/${dateString}`}>{cell}</Link>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
