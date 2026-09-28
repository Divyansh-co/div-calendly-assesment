import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Calendar } from "../components/calendar/Calendar";
import { BookingLayout } from "../components/layout/BookingLayout";
import type { TimeSlot } from "../types/booking";
import { AVAILABILITY_CONFIG } from "../../shared/availability.config";
import { AlertCircle } from "lucide-react";

export function BookingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const monthParam = searchParams.get("month");
  const dateParam = searchParams.get("date");
  const noticeParam = searchParams.get("notice");

  const [timezone, setTimezone] = useState(AVAILABILITY_CONFIG.timezone);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const now = new Date();
  let currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
    const [y, m] = monthParam.split("-").map(Number);
    currentMonth = new Date(y, m - 1, 1);
  }

  let selectedDate: Date | null = null;
  if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    const [y, m, d] = dateParam.split("-").map(Number);
    selectedDate = new Date(y, m - 1, d);
  }

  const handleDateSelect = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const monthKey = `${yyyy}-${mm}`;
    const dateKey = `${yyyy}-${mm}-${dd}`;
    setSelectedSlot(null);
    setSearchParams({ month: monthKey, date: dateKey });
  };

  const handleMonthChange = (monthDate: Date) => {
    const yyyy = monthDate.getFullYear();
    const mm = String(monthDate.getMonth() + 1).padStart(2, "0");
    const monthKey = `${yyyy}-${mm}`;
    if (dateParam) {
      setSearchParams({ month: monthKey, date: dateParam });
    } else {
      setSearchParams({ month: monthKey });
    }
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  const handleConfirmSlot = () => {
    if (!selectedSlot || !selectedSlot.iso) return;
    const monthKey =
      monthParam ||
      `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}`;
    const dateKey =
      dateParam ||
      (selectedDate
        ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(
            selectedDate.getDate()
          ).padStart(2, "0")}`
        : "");
    navigate(`/book/${encodeURIComponent(selectedSlot.iso)}?month=${monthKey}&date=${dateKey}`);
  };

  return (
    <BookingLayout step={1} timezone={timezone}>
      {noticeParam && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
          <AlertCircle size={16} className="shrink-0" />
          <span>
            {noticeParam === "unavailable"
              ? "The selected time slot is no longer available. Please select another time."
              : "The time slot link is invalid or expired. Please pick an available date and time."}
          </span>
        </div>
      )}

      <Calendar
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        selectedSlot={selectedSlot}
        timezone={timezone}
        onDateSelect={handleDateSelect}
        onSlotSelect={handleSlotSelect}
        onConfirmSlot={handleConfirmSlot}
        onMonthChange={handleMonthChange}
        onTimezoneChange={setTimezone}
      />
    </BookingLayout>
  );
}
