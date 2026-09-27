
import { CheckCircle, CalendarPlus, RotateCcw } from "lucide-react";
import type { TimeSlot } from "../../types/booking";
import { formatLongDate, convertSlotTime } from "../../lib/date-utils";
import { downloadICS } from "../../lib/ics";
import {
  EVENT_TITLE,
  HOST_NAME,
  MEETING_DURATION_LABEL,
  SUPPORTED_TIMEZONES,
} from "../../constants/config";
import { Button } from "../ui/Button";

interface ConfirmationScreenProps {
  date: Date;
  slot: TimeSlot;
  timezone: string;
  email: string;
  attendeeName?: string;
  onReset: () => void;
}

export function ConfirmationScreen({
  date,
  slot,
  timezone,
  email,
  attendeeName,
  onReset,
}: ConfirmationScreenProps) {
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

  const displayName = attendeeName?.trim() || "Attendee";

  return (
    <div
      className="step-enter text-center space-y-6 py-2"
      role="region"
      aria-live="polite"
      aria-label="Booking confirmation"
    >
      {/* Success icon — bounces in on mount */}
      <div className="flex justify-center">
        <div className="success-bounce w-16 h-16 rounded-full bg-success/10 flex items-center justify-center ring-8 ring-success/5 shadow-xs">
          <CheckCircle className="text-success" size={36} strokeWidth={2} />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-navy-900 mb-1 tracking-tight">You're booked!</h2>
        <p className="text-sm text-slate-500">
          Your session with{" "}
          <span className="font-semibold text-navy-800">{HOST_NAME}</span> has been
          scheduled.
        </p>
      </div>

      {/* Summary card */}
      <div className="card p-5 text-left space-y-4 text-sm bg-slate-50/50 border border-border/80">
        <div>
          <p className="text-xs uppercase font-semibold tracking-wider text-slate-400 mb-0.5">Event</p>
          <p className="font-bold text-navy-900 text-base">{EVENT_TITLE}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-border/70">
          <div>
            <p className="text-xs uppercase font-semibold tracking-wider text-slate-400 mb-0.5">Attendee</p>
            <p className="text-navy-900 font-semibold">{displayName}</p>
          </div>
          <div>
            <p className="text-xs uppercase font-semibold tracking-wider text-slate-400 mb-0.5">Confirmation sent to</p>
            <p className="text-navy-900 font-medium break-all">{email}</p>
          </div>
          <div>
            <p className="text-xs uppercase font-semibold tracking-wider text-slate-400 mb-0.5">Date</p>
            <p className="text-navy-900 font-semibold">{formatLongDate(date)}</p>
          </div>
          <div>
            <p className="text-xs uppercase font-semibold tracking-wider text-slate-400 mb-0.5">Time</p>
            <p className="text-navy-900 font-semibold">
              {slotLabel} – {endLabel}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase font-semibold tracking-wider text-slate-400 mb-0.5">Duration</p>
            <p className="text-navy-900 font-medium">{MEETING_DURATION_LABEL}</p>
          </div>
          <div>
            <p className="text-xs uppercase font-semibold tracking-wider text-slate-400 mb-0.5">Timezone</p>
            <p className="text-navy-900 font-medium">{tzLabel}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-2">
        <Button
          variant="primary"
          fullWidth
          onClick={() => downloadICS(date, slot, email, displayName)}
          className="shadow-sm"
        >
          <CalendarPlus size={18} />
          Add to Calendar (.ics)
        </Button>

        <Button variant="outline" fullWidth onClick={onReset}>
          <RotateCcw size={16} />
          Book another meeting
        </Button>
      </div>
    </div>
  );
}
