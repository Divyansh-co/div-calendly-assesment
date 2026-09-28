import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";
import { TimezoneSelector } from "./TimezoneSelector";
import { useAvailability } from "../../hooks/useAvailability";
import { formatMonthYear, formatDayHeader, formatSlotTime } from "../../lib/format";
import { getSlotsForDate, formatIsoDate } from "../../../shared/slots";
import { toZonedTime } from "date-fns-tz";
import type { TimeSlot } from "../../types/booking";
import { clsx } from "clsx";

interface CalendarProps {
  currentMonth: Date;
  selectedDate: Date | null;
  selectedSlot: TimeSlot | null;
  timezone: string;
  onDateSelect: (date: Date) => void;
  onSlotSelect: (slot: TimeSlot) => void;
  onConfirmSlot: () => void;
  onMonthChange: (month: Date) => void;
  onTimezoneChange: (tz: string) => void;
}

export function Calendar({
  currentMonth,
  selectedDate,
  selectedSlot,
  timezone,
  onDateSelect,
  onSlotSelect,
  onConfirmSlot,
  onMonthChange,
  onTimezoneChange,
}: CalendarProps) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const { hasBookableDates, checkDate, today } = useAvailability(year, month);

  const goPrev = () => {
    const d = new Date(year, month - 1, 1);
    onMonthChange(d);
  };

  const goNext = () => {
    const d = new Date(year, month + 1, 1);
    onMonthChange(d);
  };

  const todayFirst = new Date(today.getFullYear(), today.getMonth(), 1);
  const canGoPrev = currentMonth > todayFirst;

  const activeSlots: TimeSlot[] = selectedDate
    ? getSlotsForDate(formatIsoDate(selectedDate), today).map((inst) => {
        const istDate = toZonedTime(inst, "Asia/Kolkata");
        return {
          label: formatSlotTime(inst, "Asia/Kolkata"),
          hour: istDate.getHours(),
          minute: istDate.getMinutes(),
          iso: inst.toISOString(),
        };
      })
    : [];

  const displaySlotTime = (slot: TimeSlot) => {
    if (slot.iso) {
      return formatSlotTime(new Date(slot.iso), timezone);
    }
    return slot.label;
  };

  return (
    <div className="text-nearblack">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-nearblack">
          Select a Date & Time
        </h2>
      </div>

      <div
        className={clsx(
          "transition-all duration-200",
          selectedDate ? "flex flex-col md:flex-row gap-6 md:gap-8 items-start" : ""
        )}
      >
        {/* Calendar Left Column */}
        <div className={selectedDate ? "w-full md:w-[320px] shrink-0" : "w-full max-w-[340px]"}>
          <CalendarHeader
            currentMonth={currentMonth}
            onPrev={goPrev}
            onNext={goNext}
            canGoPrev={canGoPrev}
          />

          {hasBookableDates ? (
            <CalendarGrid
              year={year}
              month={month}
              selectedDate={selectedDate}
              today={today}
              isBookable={checkDate}
              onSelect={onDateSelect}
            />
          ) : (
            <div className="py-8 text-center text-sm text-muted">
              <p className="mb-3">No available dates in {formatMonthYear(currentMonth)}.</p>
              <button
                type="button"
                onClick={goNext}
                className="text-primary font-semibold hover:underline cursor-pointer text-xs"
              >
                View next month →
              </button>
            </div>
          )}

          <TimezoneSelector value={timezone} onChange={onTimezoneChange} />
        </div>

        {/* Time Slots Right Column (shown when a date is selected) */}
        {selectedDate && (
          <div className="w-full md:w-[240px] pt-4 md:pt-0 border-t md:border-t-0 md:border-l md:border-border md:pl-6">
            <p className="text-sm font-semibold text-nearblack mb-4">
              {formatDayHeader(selectedDate, timezone)}
            </p>

            {activeSlots.length === 0 ? (
              <p className="text-xs text-muted">No open slots for this date.</p>
            ) : (
              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
                {activeSlots.map((slot) => {
                  const isSelected =
                    selectedSlot?.hour === slot.hour && selectedSlot?.minute === slot.minute;

                  return (
                    <div key={slot.label} className="w-full">
                      {isSelected ? (
                        <div className="flex gap-2 w-full animate-in fade-in duration-150">
                          <button
                            type="button"
                            className="flex-1 py-3 px-3 rounded-lg bg-[#3E325E] text-white text-xs font-bold text-center cursor-default shadow-xs"
                          >
                            {displaySlotTime(slot)}
                          </button>
                          <button
                            type="button"
                            onClick={onConfirmSlot}
                            className="flex-1 py-3 px-3 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold text-center transition-colors cursor-pointer shadow-xs"
                          >
                            Next
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onSlotSelect(slot)}
                          className="w-full py-3 px-4 rounded-lg border border-primary text-primary font-semibold text-xs tracking-wide bg-white hover:bg-primary hover:text-white transition-all duration-150 cursor-pointer text-center"
                        >
                          {displaySlotTime(slot)}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
