
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
      <div className="flex items-start gap-3 mb-5">
        <button
          onClick={onBack}
          aria-label="Back to calendar"
          className="mt-0.5 p-1.5 rounded-lg text-slate-500 hover:bg-bg hover:text-navy-700 transition-colors duration-150 shrink-0"
        >
          <ChevronLeft size={18} />
        </button>
        <div>
          <h2 className="text-base font-semibold text-navy-900">
            {formatLongDate(date)}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{tzLabel}</p>
          <p className="text-xs text-slate-300 mt-0.5">Duration: 1 hour</p>
        </div>
      </div>

      {/* Slots */}
      {slots.length === 0 ? (
        <p className="text-sm text-slate-500 py-4 text-center">
          No available times for this date.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {slots.map((slot) => {
            const isSelected =
              selectedSlot?.hour === slot.hour && selectedSlot?.minute === slot.minute;

            return (
              <button
                key={slot.label}
                onClick={() => onSlotSelect(slot)}
                aria-pressed={isSelected}
                className={clsx(
                  "w-full rounded-lg border px-4 py-3 text-sm font-semibold transition-colors duration-150 min-h-[44px]",
                  isSelected
                    ? "bg-primary border-primary text-white"
                    : "bg-surface border-primary text-primary hover:bg-primary-tint"
                )}
              >
                {displayTime(slot)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
