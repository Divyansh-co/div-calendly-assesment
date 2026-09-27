import { useState } from "react";
import { ChevronDown, ChevronUp, Calendar, Clock, Globe } from "lucide-react";
import type { TimeSlot } from "../../types/booking";
import { formatLongDate, convertSlotTime } from "../../lib/date-utils";
import {
  EVENT_TITLE,
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
    <div className="card p-4.5 mb-6 text-sm space-y-3 bg-primary-tint/25 border border-primary/15 rounded-2xl">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-primary block mb-0.5">
          Selected Consultation
        </span>
        <p className="font-bold text-navy-900 text-base">{EVENT_TITLE}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-border/70 text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <Calendar size={14} className="text-primary shrink-0" />
          <span className="font-semibold text-navy-900">{formatLongDate(date)}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <Clock size={14} className="text-primary shrink-0" />
          <span className="font-semibold text-navy-900">{slotLabel} – {endLabel} ({MEETING_DURATION_LABEL})</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600 sm:col-span-2">
          <Globe size={14} className="text-primary shrink-0" />
          <span>{tzLabel}</span>
        </div>
      </div>

      <div className="border-t border-border/70 pt-2.5">
        <button
          type="button"
          onClick={() => setDescOpen((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover transition-colors duration-150"
          aria-expanded={descOpen}
        >
          {descOpen ? (
            <>
              Hide details <ChevronUp size={13} />
            </>
          ) : (
            <>
              View call outline <ChevronDown size={13} />
            </>
          )}
        </button>
        {descOpen && (
          <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-white/60 p-2.5 rounded-lg border border-border/60">
            A personal 1-hour consultation on wealth multiplication through agricultural land
            investments with Divyansh Mishra. Slots are strictly limited — please join on time.
          </p>
        )}
      </div>
    </div>
  );
}
