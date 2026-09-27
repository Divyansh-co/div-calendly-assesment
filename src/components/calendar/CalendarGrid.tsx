import { clsx } from "clsx";
import { getCalendarWeeks } from "../../lib/date-utils";

// Mon–Sun display order; SHORT_WEEKDAYS is Sun-indexed so we reorder.
const MON_SUN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface CalendarGridProps {
  year: number;
  month: number;
  selectedDate: Date | null;
  today: Date;
  isBookable: (date: Date) => boolean;
  onSelect: (date: Date) => void;
}

export function CalendarGrid({
  year,
  month,
  selectedDate,
  today,
  isBookable,
  onSelect,
}: CalendarGridProps) {
  const weeks = getCalendarWeeks(year, month);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const isToday = (date: Date) => isSameDay(date, today);
  const isSelected = (date: Date) => selectedDate !== null && isSameDay(date, selectedDate);

  return (
    <div>
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {MON_SUN.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-semibold text-slate-400 py-1 uppercase tracking-wider"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div className="space-y-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1">
            {week.map((date, di) => {
              if (!date) {
                return <div key={di} className="w-10 h-10" />;
              }

              const bookable = isBookable(date);
              const selected = isSelected(date);
              const today_ = isToday(date);

              return (
                <div key={di} className="flex items-center justify-center py-0.5">
                  <button
                    type="button"
                    onClick={() => bookable && onSelect(date)}
                    disabled={!bookable}
                    aria-label={`${date.getDate()} ${date.toLocaleString("en-IN", { month: "long" })} ${date.getFullYear()}${bookable ? " (Available)" : " (Unavailable)"}`}
                    aria-pressed={selected}
                    className={clsx(
                      "w-10 h-10 rounded-xl text-sm flex flex-col items-center justify-center transition-all duration-150 select-none relative",
                      selected
                        ? "bg-primary text-white font-bold shadow-md ring-2 ring-primary/40 scale-105"
                        : bookable
                        ? "text-primary font-bold bg-primary-tint/70 border border-primary/25 hover:bg-primary hover:text-white hover:border-primary shadow-xs cursor-pointer hover:scale-105 active:scale-95"
                        : "text-slate-300 cursor-not-allowed opacity-40 font-normal hover:bg-transparent",
                      today_ && !selected && "ring-1.5 ring-primary/40 font-semibold"
                    )}
                  >
                    <span>{date.getDate()}</span>
                    {bookable && !selected && (
                      <span className="w-1 h-1 rounded-full bg-primary mt-0.5" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
