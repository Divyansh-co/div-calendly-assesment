import { Clock, Globe, Calendar as CalendarIcon, ArrowLeft } from "lucide-react";
import {
  HOST_NAME,
  EVENT_TITLE,
  MEETING_DURATION_LABEL,
  DEFAULT_TIMEZONE_LABEL,
  SUPPORTED_TIMEZONES,
} from "../../constants/config";
import type { TimeSlot } from "../../types/booking";
import { formatLongDate, formatSlotTime, formatIsoDate } from "../../lib/format";
import { fromZonedTime } from "date-fns-tz";
import { Footer } from "../layout/Footer";

interface EventDetailsProps {
  step?: number;
  date?: Date | null;
  slot?: TimeSlot | null;
  timezone?: string;
  onBack?: () => void;
}

export function EventDetails({
  step = 1,
  date,
  slot,
  timezone = "Asia/Kolkata",
  onBack,
}: EventDetailsProps = {}) {
  let timeAndDateLabel = "";
  if (slot?.iso || (date && slot)) {
    const startDate = slot.iso
      ? new Date(slot.iso)
      : fromZonedTime(
          `${formatIsoDate(date!)}T${String(slot.hour).padStart(2, "0")}:${String(slot.minute).padStart(2, "0")}:00`,
          "Asia/Kolkata"
        );
    const startStr = formatSlotTime(startDate, timezone);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    const endStr = formatSlotTime(endDate, timezone);
    const dateStr = formatLongDate(startDate, timezone);
    timeAndDateLabel = `${startStr} - ${endStr}, ${dateStr}`;
  }

  const tzObj = SUPPORTED_TIMEZONES.find((t) => t.value === timezone);
  const tzLabel = tzObj ? tzObj.label : DEFAULT_TIMEZONE_LABEL;

  return (
    <div className="flex flex-col h-full text-nearblack">
      {/* On step 2: Round back-arrow button */}
      {step === 2 && onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to calendar"
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-nearblack hover:bg-butter-light mb-4 transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
      )}

      {/* Host Header */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm tracking-wide shrink-0">
            DM
          </div>
          <div>
            <span className="text-xs text-muted font-medium block">
              Host
            </span>
            <span className="text-sm font-semibold text-nearblack">
              {HOST_NAME}
            </span>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-nearblack tracking-tight leading-snug">
          {EVENT_TITLE}
        </h1>
      </div>

      {/* Meta tags */}
      <div className="flex flex-col gap-2 text-xs font-medium text-[#4A4A4A] mb-5 pb-5 border-b border-border">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-primary shrink-0" />
          <span>{MEETING_DURATION_LABEL}</span>
        </div>

        {step === 2 && timeAndDateLabel ? (
          <>
            <div className="flex items-center gap-2">
              <CalendarIcon size={16} className="text-primary shrink-0" />
              <span>{timeAndDateLabel}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-primary shrink-0" />
              <span>{tzLabel}</span>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-primary shrink-0" />
            <span>{tzLabel}</span>
          </div>
        )}
      </div>

      {/* Full Event Description (Scrollable) */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar text-sm leading-relaxed space-y-4 text-[#2A2A2A]">
        <div>
          <p className="font-bold text-nearblack mb-1">
            Before you book: this call is not with a land broker.
          </p>
          <p>
            If the phrase "wealth multiplication through land" doesn't already make sense to you, please don't book — it'll save us both time.
          </p>
        </div>

        <div>
          <p className="font-bold text-nearblack mb-1">
            Who this is for?
          </p>
          <p>
            Professionals who already earn well and have outgrown mutual funds or standard flat. You're looking at physical agricultural land as a way to grow wealth faster — targeting 25% CAGR.
          </p>
        </div>

        <div>
          <p className="font-bold text-nearblack mb-1">
            Who this isn't for?
          </p>
          <p>
            You are looking for "get-rich-quick" schemes, risky trading tips, or aren't ready to invest in solid, long-term assets or do not have capital to deploy within 30 days. I do not work with people who are just looking for free advice or window shopping.
          </p>
        </div>

        <div>
          <p className="font-bold text-nearblack mb-1">
            What we'll actually do on the call:
          </p>
          <ol className="list-decimal pl-5 space-y-1.5">
            <li><strong>Audit your current portfolio</strong> — find out where your money is underperforming.</li>
            <li><strong>Understand your goals and risk appetite</strong> — so any recommendation actually fits your situation, not a generic pitch.</li>
            <li><strong>Walk through the land-investment model</strong> — how we identify and secure lands in emerging areas that deliver 3-4x returns in a 5-7 year window.</li>
          </ol>
        </div>

        <div className="pt-2 border-t border-border">
          <p className="font-bold text-nearblack mb-1">
            Logistics
          </p>
          <p className="mb-2">
            I take these calls personally, which means I can only offer 15 slots a month. Please join on time and somewhere quiet.
          </p>
          <p>
            If there is a no-show, rebooking the call will cost ₹5,000.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
