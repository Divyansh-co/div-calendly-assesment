import type { BookingSubmission } from "../../shared/validation";

export interface BookingResponse {
  id: string;
}

export interface AvailabilityResponse {
  bookedStarts: string[];
  count: number;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function fetchAvailability(monthKey: string): Promise<AvailabilityResponse> {
  const res = await fetch(`/api/availability?month=${encodeURIComponent(monthKey)}`);
  if (!res.ok) {
    throw new ApiError("Failed to fetch availability", res.status);
  }
  return res.json();
}

export async function createBooking(data: BookingSubmission): Promise<BookingResponse> {
  const res = await fetch("/api/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const payload = (await res.json().catch(() => ({}))) as { id?: string; error?: string };

  if (!res.ok) {
    const errorMsg =
      payload.error ||
      (res.status === 409
        ? "This slot has already been booked. Please select another time."
        : "Failed to schedule event. Please try again.");
    throw new ApiError(errorMsg, res.status);
  }

  return { id: payload.id ?? `booking_${Date.now()}` };
}
