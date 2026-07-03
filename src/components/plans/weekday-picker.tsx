const WEEKDAYS = [
    { value: 0, label: "s" },
    { value: 1, label: "m" },
    { value: 2, label: "t" },
    { value: 3, label: "w" },
    { value: 4, label: "t" },
    { value: 5, label: "f" },
    { value: 6, label: "s" },
  ];
  
  export function WeekdayPicker({ defaultValue = [] }: { defaultValue?: number[] }) {
    return (
      <div className="flex gap-2">
        {WEEKDAYS.map(({ value, label }) => (
          <label key={value} className="cursor-pointer">
            <input
              type="checkbox"
              name="weekdays"
              value={value}
              defaultChecked={defaultValue.includes(value)}
              className="peer sr-only"
            />
            <span className="flex size-9 items-center justify-center rounded-full border border-border text-sm font-medium text-muted-foreground peer-checked:border-transparent peer-checked:bg-primary peer-checked:text-primary-foreground">
              {label}
            </span>
          </label>
        ))}
      </div>
    );
  }
  