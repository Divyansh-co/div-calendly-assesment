import { useMemo } from "react";
import { useParams, useLocation, useNavigate, Navigate } from "react-router-dom";
import { ConfirmationScreen } from "../components/booking/ConfirmationScreen";
import { BookingLayout } from "../components/layout/BookingLayout";
import type { TimeSlot } from "../types/booking";

interface StoredBooking {
  id: string;
  createdAt: string;
  host: string;
  eventTitle: string;
  date: string;
  slot: TimeSlot;
  timezone: string;
  attendee: {
    firstName: string;
    lastName: string;
    email: string;
    guests: string[];
    city: string;
    hometown: string;
    income: string;
    landSize: string[];
    whatsapp: string;
  };
}

export function ConfirmedPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const booking = useMemo<StoredBooking | null>(() => {
    if (location.state && (location.state as { booking?: StoredBooking }).booking) {
      return (location.state as { booking: StoredBooking }).booking;
    }
    if (!bookingId) return null;
    try {
      const stored = JSON.parse(localStorage.getItem("booked_meetings") || "[]") as StoredBooking[];
      return stored.find((b) => b.id === bookingId) || null;
    } catch {
      return null;
    }
  }, [bookingId, location.state]);

  if (!booking) {
    return <Navigate to="/" replace />;
  }

  const bookingDate = new Date(booking.date);
  const attendeeName = `${booking.attendee.firstName} ${booking.attendee.lastName}`.trim();

  return (
    <BookingLayout step={3} date={bookingDate} slot={booking.slot} timezone={booking.timezone}>
      <ConfirmationScreen
        date={bookingDate}
        slot={booking.slot}
        timezone={booking.timezone}
        email={booking.attendee.email}
        attendeeName={attendeeName}
        onReset={() => navigate("/")}
      />
    </BookingLayout>
  );
}
