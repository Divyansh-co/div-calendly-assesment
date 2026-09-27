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
      <div className="grid grid-cols-7 mb-1">
        {MON_SUN.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-medium text-slate-300 py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div className="space-y-0.5">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((date, di) => {
              if (!date) {
                return <div key={di} />;
              }

              const bookable = isBookable(date);
              const selected = isSelected(date);
              const today_ = isToday(date);

              return (
                <div key={di} className="flex items-center justify-center py-0.5">
                  <button
                    onClick={() => bookable && onSelect(date)}
                    disabled={!bookable}
                    aria-label={`${date.getDate()} ${date.toLocaleString("en-IN", { month: "long" })} ${date.getFullYear()}${bookable ? "" : ", not available"}`}
                    aria-pressed={selected}
                    className={clsx(
                      "w-9 h-9 rounded-full text-sm flex items-center justify-center transition-colors duration-150 select-none",
                      selected
                        ? "bg-primary text-white font-semibold"
                        : bookable
                        ? "text-navy-700 font-semibold hover:bg-primary-tint hover:text-primary cursor-pointer"
                        : "text-slate-300 cursor-not-allowed opacity-50 font-normal",
                      today_ && !selected && "ring-1 ring-primary/40"
                    )}
                  >
                    {date.getDate()}
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
