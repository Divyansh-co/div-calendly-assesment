import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import { formatInTimeZone } from "date-fns-tz";
import { AVAILABILITY_CONFIG } from "../shared/availability.config.js";
import { getSlotsForDate, isBlockedDate } from "../shared/slots.js";
import { bookingSubmissionSchema } from "../shared/validation.js";

declare const process: {
  env: Record<string, string | undefined>;
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const parsed = bookingSubmissionSchema.safeParse(req.body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message ?? "Invalid booking details";
    res.status(400).json({ error: firstIssue });
    return;
  }

  const submission = parsed.data;

  // Honeypot validation
  if (submission.website && submission.website.trim().length > 0) {
    res.status(400).json({ error: "Spam submission detected" });
    return;
  }

  const slotDate = new Date(submission.slotIso);
  if (isNaN(slotDate.getTime())) {
    res.status(400).json({ error: "Invalid slot date" });
    return;
  }

  const isoDate = formatInTimeZone(slotDate, AVAILABILITY_CONFIG.timezone, "yyyy-MM-dd");
  const monthKey = isoDate.slice(0, 7);

  if (isBlockedDate(isoDate)) {
    res.status(400).json({ error: "Selected date is unavailable" });
    return;
  }

  // Validate that slot matches predefined schedule windows and min notice
  const validSlots = getSlotsForDate(isoDate, new Date(), []);
  const isValidSlotTime = validSlots.some((s) => s.getTime() === slotDate.getTime());
  if (!isValidSlotTime) {
    res.status(400).json({ error: "Selected time slot is outside available windows or in the past" });
    return;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    // Fallback when running without Postgres configured
    const simulatedId = "mock-" + Date.now();
    res.status(201).json({ id: simulatedId });
    return;
  }

  try {
    const sql = neon(databaseUrl);

    // Enforce monthly cap
    const monthCountRows = await sql`
      SELECT COUNT(*)::int AS count
      FROM bookings
      WHERE month_key = ${monthKey}
    `;
    const currentMonthCount = (monthCountRows[0]?.count as number) ?? 0;
    if (currentMonthCount >= AVAILABILITY_CONFIG.monthlyCap) {
      res.status(409).json({ error: "Monthly booking limit of 15 meetings reached for this month" });
      return;
    }

    const insertedRows = await sql`
      INSERT INTO bookings (
        start_at,
        month_key,
        first_name,
        last_name,
        email,
        guests,
        city,
        hometown,
        income,
        land_sizes,
        whatsapp
      ) VALUES (
        ${slotDate.toISOString()},
        ${monthKey},
        ${submission.firstName},
        ${submission.lastName},
        ${submission.email},
        ${JSON.stringify(submission.guests)},
        ${submission.city},
        ${submission.hometown},
        ${submission.income},
        ${JSON.stringify(submission.landSizes)},
        ${submission.whatsapp}
      )
      RETURNING id
    `;

    const newId = insertedRows[0]?.id as string;
    res.status(201).json({ id: newId });
  } catch (err: unknown) {
    // Unique violation error code in PostgreSQL is 23505
    const isConflict =
      err &&
      typeof err === "object" &&
      ("code" in err && err.code === "23505" ||
        "message" in err && typeof err.message === "string" && err.message.includes("bookings_start_at_key"));

    if (isConflict) {
      res.status(409).json({ error: "This slot has already been booked. Please select another time." });
      return;
    }

    const message = err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({ error: message });
  }
}
