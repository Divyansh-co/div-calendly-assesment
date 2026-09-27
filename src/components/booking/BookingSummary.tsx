import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { TimeSlot } from "../../types/booking";
import { formatLongDate, convertSlotTime } from "../../lib/date-utils";
import {
  EVENT_TITLE,
  HOST_NAME,
  MEETING_DURATION_LABEL,
  SUPPORTED_TIMEZONES,
} from "../../constants/config";

interface BookingSummaryProps {
  date: Date;
  slot: TimeSlot;
  timezone: string;
}

export function BookingSummary({ date, slot, timezone }: BookingSummaryProps) {
  const [descOpen, setDescOpen] = useState(false);
  const tzLabel =
    SUPPORTED_TIMEZONES.find((t) => t.value === timezone)?.label ?? timezone;

  const slotLabel =
    timezone === "Asia/Kolkata"
      ? slot.label
      : convertSlotTime(date, slot.hour, slot.minute, timezone);

  const endHour = Math.floor((slot.hour * 60 + slot.minute + 60) / 60);
  const endMin = (slot.hour * 60 + slot.minute + 60) % 60;
  const endLabel =
    timezone === "Asia/Kolkata"
      ? `${endHour % 12 || 12}:${String(endMin).padStart(2, "0")} ${endHour >= 12 ? "PM" : "AM"}`
      : convertSlotTime(date, endHour, endMin, timezone);

  return (
    <div className="card p-4 mb-6 text-sm space-y-2">
      <p className="font-semibold text-navy-900">{EVENT_TITLE}</p>

      <div className="text-slate-500 space-y-1">
        <p>
          <span className="text-xs uppercase tracking-wide text-slate-300 mr-1">Host</span>
          {HOST_NAME}
        </p>
        <p>
          <span className="text-xs uppercase tracking-wide text-slate-300 mr-1">Duration</span>
          {MEETING_DURATION_LABEL}
        </p>
        <p>
          <span className="text-xs uppercase tracking-wide text-slate-300 mr-1">Date</span>
          {formatLongDate(date)}
        </p>
        <p>
          <span className="text-xs uppercase tracking-wide text-slate-300 mr-1">Time</span>
          {slotLabel} – {endLabel}
        </p>
        <p>
          <span className="text-xs uppercase tracking-wide text-slate-300 mr-1">Zone</span>
          {tzLabel}
        </p>
      </div>

      {/* Collapsible description row */}
      <div className="border-t border-border pt-2">
        <button
          onClick={() => setDescOpen((v) => !v)}
          className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-primary transition-colors duration-150"
          aria-expanded={descOpen}
        >
          Description {descOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
        {descOpen && (
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            A personal 1-hour consultation on wealth multiplication through agricultural land
            investments. Taken personally by {HOST_NAME}. Slots are limited — please join on time.
          </p>
        )}
      </div>
    </div>
  );
}
