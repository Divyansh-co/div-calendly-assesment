import { SUPPORTED_TIMEZONES } from "../../constants/config";

interface TimezoneSelectorProps {
  value: string;
  onChange: (tz: string) => void;
}

export function TimezoneSelector({ value, onChange }: TimezoneSelectorProps) {
  const now = new Date();
  const localTime = now.toLocaleTimeString("en-IN", {
    timeZone: value,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="flex items-center gap-2 mt-5 pt-4 border-t border-border">
      <span className="text-base shrink-0">🌐</span>
      <div className="flex-1 min-w-0">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Timezone"
          className="w-full text-sm text-slate-500 bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer truncate appearance-none"
        >
          {SUPPORTED_TIMEZONES.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-slate-300 mt-0.5">
          Current time: {localTime}
        </p>
      </div>
    </div>
  );
}
