export const HOST_NAME = "Harsh Gupta";
export const EVENT_TITLE = "wealth multiplication via agri land investments";
export const MEETING_DURATION_LABEL = "1 hour";
export const MEETING_DURATION_MINUTES = 60;

// All slot times are defined in IST (Asia/Kolkata)
export const DEFAULT_TIMEZONE = "Asia/Kolkata";
export const DEFAULT_TIMEZONE_LABEL = "India Standard Time";

export const SUPPORTED_TIMEZONES: { value: string; label: string }[] = [
  { value: "Asia/Kolkata",        label: "India Standard Time" },
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
  { value: "",                  label: "Select…" },
  { value: "15l-25l",          label: "₹15 Lakhs – ₹25 Lakhs" },
  { value: "25l-50l",          label: "₹25 Lakhs – ₹50 Lakhs" },
  { value: "50l-75l",          label: "₹50 Lakhs – ₹75 Lakhs" },
  { value: "75l-1cr",          label: "₹75 Lakhs – ₹1 Crore" },
  { value: "1cr-plus",         label: "₹1 Crore+" },
];

export const LAND_SIZE_OPTIONS = [
  { value: "1000 sqm",         label: "1000 sqm" },
  { value: "1000-2000 sqm",    label: "1000-2000 sqm" },
  { value: "2000 sqm+",        label: "2000 sqm+" },
];

