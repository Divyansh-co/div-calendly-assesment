import { CheckCircle, CalendarPlus, RotateCcw } from "lucide-react";
import type { TimeSlot } from "../../types/booking";
import { formatLongDate, formatSlotTime, formatIsoDate } from "../../lib/format";
import { fromZonedTime } from "date-fns-tz";
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

  const startDate = slot.iso
    ? new Date(slot.iso)
    : fromZonedTime(
        `${formatIsoDate(date)}T${String(slot.hour).padStart(2, "0")}:${String(slot.minute).padStart(2, "0")}:00`,
        "Asia/Kolkata"
      );
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  const slotLabel = formatSlotTime(startDate, timezone);
  const endLabel = formatSlotTime(endDate, timezone);
  const dateLabel = formatLongDate(startDate, timezone);

  const displayName = attendeeName?.trim() || "Attendee";

  return (
    <div
      className="text-center space-y-6 py-4 text-nearblack"
      role="region"
      aria-label="Booking confirmation"
    >
      <div className="flex justify-center">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <CheckCircle className="text-primary" size={32} />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-nearblack mb-1.5">You're booked!</h2>
        <p className="text-sm text-[#4A4A4A]">
          Your session with{" "}
          <span className="font-semibold text-nearblack">{HOST_NAME}</span> has been
          scheduled.
        </p>
      </div>

      <div className="p-5 text-left space-y-3.5 text-sm bg-butter-light/50 border border-butter-border rounded-xl">
        <div>
          <p className="text-xs uppercase font-semibold text-muted mb-0.5">Event</p>
          <p className="font-bold text-nearblack text-base">{EVENT_TITLE}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2.5 border-t border-butter-border">
          <div>
            <p className="text-xs uppercase font-semibold text-muted mb-0.5">Attendee</p>
            <p className="text-nearblack font-semibold">{displayName}</p>
          </div>
          <div>
            <p className="text-xs uppercase font-semibold text-muted mb-0.5">Confirmation email sent to</p>
            <p className="text-nearblack font-medium break-all">{email}</p>
          </div>
          <div>
            <p className="text-xs uppercase font-semibold text-muted mb-0.5">Date</p>
            <p className="text-nearblack font-semibold">{dateLabel}</p>
          </div>
          <div>
            <p className="text-xs uppercase font-semibold text-muted mb-0.5">Time</p>
            <p className="text-nearblack font-semibold">
              {slotLabel} – {endLabel}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase font-semibold text-muted mb-0.5">Duration</p>
            <p className="text-nearblack font-medium">{MEETING_DURATION_LABEL}</p>
          </div>
          <div>
            <p className="text-xs uppercase font-semibold text-muted mb-0.5">Timezone</p>
            <p className="text-nearblack font-medium">{tzLabel}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <Button
          variant="primary"
          fullWidth
          onClick={() => downloadICS(date, slot, email, displayName)}
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
