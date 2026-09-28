import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatMonthYear } from "../../lib/format";

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
    <div className="flex items-center justify-between mb-4 px-1">
      <h2 className="text-base font-semibold text-nearblack">
        {formatMonthYear(currentMonth)}
      </h2>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canGoPrev}
          aria-label="Previous month"
          className="p-1.5 rounded-full text-primary hover:bg-primary-tint disabled:text-muted disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer"
          title={canGoPrev ? "Previous month" : "Past months not available"}
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-label="Next month"
          className="p-1.5 rounded-full text-primary hover:bg-primary-tint transition-colors cursor-pointer"
          title="Next month"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
