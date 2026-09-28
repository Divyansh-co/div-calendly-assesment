import { clsx } from "clsx";
import { getCalendarWeeks } from "../../lib/format";

const MON_SUN = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

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
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {MON_SUN.map((d) => (
          <div
            key={d}
            className="text-center text-[11px] font-semibold text-muted py-1 tracking-wider"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
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
                <div key={di} className="flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => bookable && onSelect(date)}
                      disabled={!bookable}
                      tabIndex={bookable ? 0 : -1}
                      aria-label={`${date.getDate()} ${date.toLocaleString("en-IN", { month: "long" })} ${date.getFullYear()}${bookable ? " (Available)" : " (Unavailable)"}`}
                      aria-pressed={selected}
                      className={clsx(
                        "relative w-10 h-10 rounded-full text-sm flex items-center justify-center transition-all duration-150 ease-out select-none",
                        selected
                          ? "bg-primary text-white font-bold shadow-xs"
                          : bookable
                          ? "text-primary bg-primary-tint/70 font-bold hover:bg-primary hover:text-white cursor-pointer"
                          : "text-muted/60 font-normal cursor-default"
                      )}
                    >
                      <span>{date.getDate()}</span>
                      {today_ && (
                        <span
                          className={clsx(
                            "absolute bottom-1 w-1 h-1 rounded-full",
                            selected ? "bg-white" : "bg-primary"
                          )}
                          aria-hidden="true"
                        />
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
