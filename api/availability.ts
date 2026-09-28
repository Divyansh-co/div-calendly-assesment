import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";

declare const process: {
  env: Record<string, string | undefined>;
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { month } = req.query;
  const monthKey = Array.isArray(month) ? month[0] : month;

  if (!monthKey || !/^\d{4}-\d{2}$/.test(monthKey)) {
    res.status(400).json({ error: "Invalid or missing month parameter. Format must be YYYY-MM" });
    return;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    res.status(200).json({ bookedStarts: [], count: 0 });
    return;
  }

  try {
    const sql = neon(databaseUrl);
    const rows = await sql`
      SELECT start_at
      FROM bookings
      WHERE month_key = ${monthKey}
      ORDER BY start_at ASC
    `;

    const bookedStarts = rows.map((r) => new Date(r.start_at as string | Date).toISOString());

    res.setHeader("Cache-Control", "no-store, max-age=0");
    res.status(200).json({
      bookedStarts,
      count: bookedStarts.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Database error";
    res.status(500).json({ error: message });
  }
}
