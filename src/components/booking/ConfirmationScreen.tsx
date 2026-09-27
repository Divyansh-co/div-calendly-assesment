
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
  onReset: () => void;
}

export function ConfirmationScreen({
  date,
  slot,
  timezone,
  email,
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

  return (
    <div
      className="step-enter text-center space-y-6 py-4"
      role="region"
      aria-live="polite"
      aria-label="Booking confirmation"
    >
      {/* Success icon */}
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
          <CheckCircle className="text-success" size={36} strokeWidth={1.75} />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-navy-900 mb-1">You're booked!</h2>
        <p className="text-sm text-slate-500">
          Your session with{" "}
          <span className="font-medium text-navy-700">{HOST_NAME}</span> has been
          scheduled.
        </p>
      </div>

      {/* Summary card */}
      <div className="card p-5 text-left space-y-3 text-sm">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-300 mb-0.5">Event</p>
          <p className="font-semibold text-navy-900">{EVENT_TITLE}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-300 mb-0.5">Date</p>
            <p className="text-navy-700">{formatLongDate(date)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-300 mb-0.5">Time</p>
            <p className="text-navy-700">
              {slotLabel} – {endLabel}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-300 mb-0.5">Duration</p>
            <p className="text-navy-700">{MEETING_DURATION_LABEL}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-300 mb-0.5">Timezone</p>
            <p className="text-navy-700">{tzLabel}</p>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-slate-300 mb-0.5">
            Confirmation sent to
          </p>
          <p className="text-navy-700 break-all">{email}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Button
          variant="primary"
          fullWidth
          onClick={() => downloadICS(date, slot, email)}
        >
          <CalendarPlus size={16} />
          Add to Calendar
        </Button>

        <Button variant="outline" fullWidth onClick={onReset}>
          <RotateCcw size={16} />
          Book another
        </Button>
      </div>
    </div>
  );
}
