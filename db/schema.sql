-- Neon Postgres schema for bookings

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  start_at timestamptz UNIQUE NOT NULL,
  month_key text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  guests jsonb NOT NULL DEFAULT '[]'::jsonb,
  city text NOT NULL,
  hometown text NOT NULL,
  income text NOT NULL,
  land_sizes jsonb NOT NULL DEFAULT '[]'::jsonb,
  whatsapp text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bookings_month_key ON bookings(month_key);
CREATE INDEX IF NOT EXISTS idx_bookings_start_at ON bookings(start_at);
