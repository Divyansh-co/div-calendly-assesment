
import { clsx } from "clsx";
import { ChevronLeft } from "lucide-react";
import type { TimeSlot } from "../../types/booking";
import { formatLongDate, convertSlotTime } from "../../lib/date-utils";
import { getSlotsForDate } from "../../lib/availability";
import { SUPPORTED_TIMEZONES } from "../../constants/config";

interface TimeSlotListProps {
  date: Date;
  timezone: string;
  selectedSlot: TimeSlot | null;
  onSlotSelect: (slot: TimeSlot) => void;
  onBack: () => void;
}

export function TimeSlotList({
  date,
  timezone,
  selectedSlot,
  onSlotSelect,
  onBack,
}: TimeSlotListProps) {
  const slots = getSlotsForDate(date);
  const tzLabel =
    SUPPORTED_TIMEZONES.find((t) => t.value === timezone)?.label ?? timezone;

  const displayTime = (slot: TimeSlot) => {
    if (timezone === "Asia/Kolkata") return slot.label;
    return convertSlotTime(date, slot.hour, slot.minute, timezone);
  };

  return (
    <div className="step-enter">
      {/* Header */}
      <div className="flex items-start gap-3.5 mb-6 pb-4 border-b border-border/80">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to calendar"
          className="mt-0.5 p-2 rounded-xl border border-border/80 bg-surface text-slate-600 hover:bg-slate-50 hover:text-navy-900 hover:border-slate-300 active:scale-95 transition-all duration-150 shrink-0 shadow-xs"
          title="Back to calendar"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary block mb-0.5">
            Step 2 of 3
          </span>
          <h2 className="text-lg font-bold text-navy-900 tracking-tight">
            {formatLongDate(date)}
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1 font-medium bg-slate-100 px-2.5 py-0.5 rounded-full text-navy-800">
              {tzLabel}
            </span>
            <span>•</span>
            <span>Duration: 60 min</span>
          </div>
        </div>
      </div>

      {/* Slots */}
      {slots.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-border">
          <p className="text-sm font-medium text-slate-600">
            No available times for this date.
          </p>
          <button
            type="button"
            onClick={onBack}
            className="mt-3 text-sm font-semibold text-primary hover:underline"
          >
            ← Choose another date
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Select an available time
          </p>
          <div className="grid grid-cols-1 gap-3">
            {slots.map((slot) => {
              const isSelected =
                selectedSlot?.hour === slot.hour && selectedSlot?.minute === slot.minute;

              return (
                <button
                  key={slot.label}
                  type="button"
                  onClick={() => onSlotSelect(slot)}
                  aria-pressed={isSelected}
                  className={clsx(
                    "w-full rounded-xl border-2 px-5 py-3.5 text-sm font-bold transition-all duration-150 min-h-[52px] flex items-center justify-between shadow-xs",
                    isSelected
                      ? "bg-primary border-primary text-white shadow-md scale-[1.01]"
                      : "bg-surface border-primary/30 text-primary hover:bg-primary-tint hover:border-primary active:scale-[0.99] cursor-pointer"
                  )}
                >
                  <span className="text-base">{displayTime(slot)}</span>
                  <span
                    className={clsx(
                      "text-xs px-2.5 py-1 rounded-full font-semibold",
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-primary-tint text-primary border border-primary/20"
                    )}
                  >
                    60 min
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
