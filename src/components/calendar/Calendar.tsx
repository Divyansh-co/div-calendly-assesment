
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
        <div className="py-8 text-center">
          <p className="text-sm text-slate-500 mb-2">
            No available times in {formatMonthYear(currentMonth)}
          </p>
          <button
            onClick={goNext}
            className="text-sm font-medium text-primary hover:text-primary-hover transition-colors duration-150"
          >
            View next month →
          </button>
        </div>
      )}

      <TimezoneSelector value={timezone} onChange={onTimezoneChange} />
    </div>
  );
}
