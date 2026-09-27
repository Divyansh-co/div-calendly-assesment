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
    <div className="flex items-center justify-between p-3.5 mb-5 rounded-xl bg-primary-tint/50 border border-primary/10">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
        <h2 className="text-base font-bold text-navy-900 tracking-tight">
          {formatMonthYear(currentMonth)}
        </h2>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canGoPrev}
          aria-label="Previous month"
          className="p-2 rounded-lg text-slate-600 bg-surface border border-border/80 shadow-xs hover:bg-white hover:text-primary hover:border-primary/30 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-surface disabled:hover:text-slate-600 disabled:hover:border-border/80 disabled:active:scale-100 transition-all duration-150"
          title={canGoPrev ? "Previous month" : "Cannot navigate to past months"}
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-label="Next month"
          className="p-2 rounded-lg text-slate-600 bg-surface border border-border/80 shadow-xs hover:bg-white hover:text-primary hover:border-primary/30 active:scale-95 transition-all duration-150"
          title="Next month"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
