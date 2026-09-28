import { useState } from "react";
import { useParams, useSearchParams, useNavigate, Navigate } from "react-router-dom";
import { BookingForm } from "../components/booking/BookingForm";
import { BookingLayout } from "../components/layout/BookingLayout";
import type { BookingFormData, TimeSlot } from "../types/booking";
import { AVAILABILITY_CONFIG } from "../../shared/availability.config";
import { formatIsoDate, getSlotsForDate } from "../../shared/slots";
import { formatSlotTime } from "../lib/format";
import { toZonedTime } from "date-fns-tz";
import { HOST_NAME, EVENT_TITLE } from "../constants/config";

export function DetailsPage() {
  const { slotIso } = useParams<{ slotIso: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const monthParam = searchParams.get("month");
  const dateParam = searchParams.get("date");

  const [formData, setFormData] = useState<BookingFormData>({
    firstName: "",
    lastName: "",
    email: "",
    guests: [],
    city: "",
    hometown: "",
    income: "",
    landSize: [],
    whatsapp: "",
  });

  const decodedIso = decodeURIComponent(slotIso || "");
  const slotDate = new Date(decodedIso);

  if (isNaN(slotDate.getTime())) {
    return <Navigate to="/?notice=invalid-slot" replace />;
  }

  const istDateStr = formatIsoDate(slotDate, AVAILABILITY_CONFIG.timezone);
  const now = new Date();
  const validSlots = getSlotsForDate(istDateStr, now);

  const slotMatch = validSlots.find((s) => s.getTime() === slotDate.getTime());
  if (!slotMatch) {
    return <Navigate to="/?notice=unavailable" replace />;
  }

  const istZoned = toZonedTime(slotDate, AVAILABILITY_CONFIG.timezone);
  const slot: TimeSlot = {
    label: formatSlotTime(slotDate, AVAILABILITY_CONFIG.timezone),
    hour: istZoned.getHours(),
    minute: istZoned.getMinutes(),
    iso: slotDate.toISOString(),
  };

  const handleBack = () => {
    if (monthParam && dateParam) {
      navigate(`/?month=${monthParam}&date=${dateParam}`);
    } else {
      navigate("/");
    }
  };

  const handleUpdateFormData = (updates: Partial<BookingFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleConfirmBooking = () => {
    const bookingId = `booking_${Date.now()}`;
    const newBooking = {
      id: bookingId,
      createdAt: new Date().toISOString(),
      host: HOST_NAME,
      eventTitle: EVENT_TITLE,
      date: slotDate.toISOString(),
      slot,
      timezone: AVAILABILITY_CONFIG.timezone,
      attendee: formData,
    };

    try {
      const existing = JSON.parse(localStorage.getItem("booked_meetings") || "[]");
      localStorage.setItem("booked_meetings", JSON.stringify([...existing, newBooking]));
    } catch (e) {
      console.error("Failed to save booking to localStorage", e);
    }

    navigate(`/confirmed/${bookingId}`, { state: { booking: newBooking } });
  };

  return (
    <BookingLayout
      step={2}
      date={slotDate}
      slot={slot}
      timezone={AVAILABILITY_CONFIG.timezone}
      onBack={handleBack}
    >
      <BookingForm
        date={slotDate}
        slot={slot}
        timezone={AVAILABILITY_CONFIG.timezone}
        formData={formData}
        onUpdate={handleUpdateFormData}
        onBack={handleBack}
        onConfirm={handleConfirmBooking}
      />
    </BookingLayout>
  );
}
