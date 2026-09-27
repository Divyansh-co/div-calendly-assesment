import { useState, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { SUPPORTED_TIMEZONES } from "../../constants/config";

interface TimezoneSelectorProps {
  value: string;
  onChange: (tz: string) => void;
}

export function TimezoneSelector({ value, onChange }: TimezoneSelectorProps) {
  // Live ticking clock state
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const localTime = currentTime.toLocaleTimeString("en-IN", {
    timeZone: value,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className="mt-6 pt-4 border-t border-border/80">
      <label htmlFor="timezone-select" className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
        Time zone
      </label>
      <div className="relative flex items-center rounded-xl border border-border bg-slate-50/60 hover:bg-slate-50 hover:border-slate-300 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-150 px-3 py-2">
        <Globe size={16} className="text-primary shrink-0 mr-2.5" />
        <div className="flex-1 min-w-0 pr-6">
          <select
            id="timezone-select"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label="Select your time zone"
            className="w-full text-xs font-semibold text-navy-900 bg-transparent border-none p-0 focus:outline-none focus:ring-0 cursor-pointer truncate appearance-none"
          >
            {SUPPORTED_TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5" aria-live="off">
            Current time: <span className="font-semibold text-navy-800">{localTime}</span>
          </p>
        </div>
        <ChevronDown size={14} className="text-slate-400 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
}
