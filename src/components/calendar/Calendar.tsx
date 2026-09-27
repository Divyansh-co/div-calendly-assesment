
import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";
import { TimezoneSelector } from "./TimezoneSelector";
import { useAvailability } from "../../hooks/useAvailability";
import { formatMonthYear } from "../../lib/date-utils";

interface CalendarProps {
  currentMonth: Date;
  selectedDate: Date | null;
  timezone: string;
  onDateSelect: (date: Date) => void;
  onMonthChange: (month: Date) => void;
  onTimezoneChange: (tz: string) => void;
}

export function Calendar({
  currentMonth,
  selectedDate,
  timezone,
  onDateSelect,
  onMonthChange,
  onTimezoneChange,
}: CalendarProps) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const { hasBookableDates, checkDate, today } = useAvailability(year, month);

  const goPrev = () => {
    const d = new Date(year, month - 1, 1);
    onMonthChange(d);
  };

  const goNext = () => {
    const d = new Date(year, month + 1, 1);
    onMonthChange(d);
  };

  // Disable going back to a month already in the past
  const todayFirst = new Date(today.getFullYear(), today.getMonth(), 1);
  const canGoPrev = currentMonth > todayFirst;

  return (
    <div>
      <CalendarHeader
        currentMonth={currentMonth}
        onPrev={goPrev}
        onNext={goNext}
        canGoPrev={canGoPrev}
      />

      {hasBookableDates ? (
        <CalendarGrid
          year={year}
          month={month}
          selectedDate={selectedDate}
          today={today}
          isBookable={checkDate}
          onSelect={onDateSelect}
        />
      ) : (
        <div className="min-h-[320px] flex flex-col items-center justify-center p-8 bg-slate-50/70 rounded-2xl border border-dashed border-border/90 text-center my-3">
          {/* Subtle line-art calendar/clock icon */}
          <div className="w-16 h-16 rounded-full bg-primary-tint border border-primary/20 flex items-center justify-center mb-4 text-primary shadow-xs ring-8 ring-primary-tint/40">
            <svg
              className="w-8 h-8 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <circle cx="12" cy="15" r="2.5" />
              <polyline points="12 13.5 12 15 13.5 15" />
            </svg>
          </div>

          <h3 className="text-base font-bold text-navy-900 mb-1.5">
            No available times in {formatMonthYear(currentMonth)}
          </h3>
          <p className="text-sm text-slate-500 max-w-xs mb-6 leading-relaxed">
            All consultation slots for this month are fully booked or have passed. Check upcoming months to schedule your call.
          </p>

          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover shadow-sm transition-all duration-150 hover:shadow hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>View next month</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      )}

      <TimezoneSelector value={timezone} onChange={onTimezoneChange} />
    </div>
  );
}
