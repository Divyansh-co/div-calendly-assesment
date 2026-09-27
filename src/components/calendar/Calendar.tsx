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
        <div className="min-h-[340px] flex flex-col items-center justify-center p-8 sm:p-12 text-center my-3 bg-slate-50/50 rounded-2xl border border-dashed border-border/80">
          <div className="w-14 h-14 rounded-2xl bg-white border border-border shadow-xs flex items-center justify-center mb-5 text-slate-300">
            <svg
              className="w-7 h-7 text-slate-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="3" ry="3" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <line x1="8" y1="14" x2="8.01" y2="14" strokeWidth="2.5" />
              <line x1="12" y1="14" x2="12.01" y2="14" strokeWidth="2.5" />
              <line x1="16" y1="14" x2="16.01" y2="14" strokeWidth="2.5" />
            </svg>
          </div>

          <h3 className="text-base font-bold text-navy-900 mb-1.5 tracking-tight">
            No available times in {formatMonthYear(currentMonth)}
          </h3>
          <p className="text-sm text-slate-500 max-w-xs mb-6 leading-relaxed">
            No open dates this month. Check next month to find an available time.
          </p>

          <button
            type="button"
            onClick={goNext}
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover shadow-xs hover:shadow-md transition-all duration-150 active:scale-[0.98]"
          >
            <span>View next month</span>
            <span className="inline-block transition-transform duration-150 ease-out group-hover:translate-x-1" aria-hidden="true">→</span>
          </button>
        </div>
      )}

      <TimezoneSelector value={timezone} onChange={onTimezoneChange} />
    </div>
  );
}
