export const HOST_NAME = "Divyansh Mishra";
export const EVENT_TITLE = "Wealth Multiplication via Agri Land Investments";
export const MEETING_DURATION_LABEL = "60 min";
export const MEETING_DURATION_MINUTES = 60;

// All slot times are defined in IST; this is the default shown to users.
export const DEFAULT_TIMEZONE = "Asia/Kolkata";
export const DEFAULT_TIMEZONE_LABEL = "India Standard Time (IST)";

export const SUPPORTED_TIMEZONES: { value: string; label: string }[] = [
  { value: "Asia/Kolkata",        label: "India Standard Time (IST)" },
  { value: "Asia/Dubai",          label: "Gulf Standard Time (GST)" },
  { value: "Europe/London",       label: "British Time (GMT/BST)" },
  { value: "America/New_York",    label: "Eastern Time (ET)" },
  { value: "America/Chicago",     label: "Central Time (CT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Asia/Singapore",      label: "Singapore Time (SGT)" },
];

export const HOMETOWN_OPTIONS = [
  "Delhi/NCR",
  "Uttar Pradesh/Haryana",
  "Punjab",
] as const;

export const INCOME_OPTIONS = [
  { value: "",           label: "Select income range" },
  { value: "below-5l",  label: "Below ₹5 lakh" },
  { value: "5l-10l",    label: "₹5–10 lakh" },
  { value: "10l-20l",   label: "₹10–20 lakh" },
  { value: "20l-50l",   label: "₹20–50 lakh" },
  { value: "50l-plus",  label: "₹50 lakh+" },
];

// optional — user picks how much land they're interested in
export const LAND_SIZE_OPTIONS = [
  { value: "1000sqm",      label: "1000 sqm" },
  { value: "1000-2000sqm", label: "1000–2000 sqm" },
  { value: "2000sqm-plus", label: "2000 sqm+" },
];
