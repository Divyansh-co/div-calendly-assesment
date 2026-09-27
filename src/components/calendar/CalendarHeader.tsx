
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatMonthYear } from "../../lib/date-utils";

interface CalendarHeaderProps {
  currentMonth: Date;
  onPrev: () => void;
  onNext: () => void;
  canGoPrev: boolean;
}

export function CalendarHeader({
  currentMonth,
  onPrev,
  onNext,
  canGoPrev,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-semibold text-navy-900">
        {formatMonthYear(currentMonth)}
      </h2>
      <div className="flex items-center gap-1">
        <button
          onClick={onPrev}
          disabled={!canGoPrev}
          aria-label="Previous month"
          className="p-2 rounded-lg text-slate-500 hover:bg-bg hover:text-navy-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={onNext}
          aria-label="Next month"
          className="p-2 rounded-lg text-slate-500 hover:bg-bg hover:text-navy-700 transition-colors duration-150"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
