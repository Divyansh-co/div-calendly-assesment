import { Globe, ChevronDown } from "lucide-react";
import { SUPPORTED_TIMEZONES } from "../../constants/config";
import { useNow } from "../../hooks/useNow";
import { formatInTimeZone } from "date-fns-tz";

interface TimezoneSelectorProps {
  value: string;
  onChange: (tz: string) => void;
}

export function TimezoneSelector({ value, onChange }: TimezoneSelectorProps) {
  const now = useNow(60000);

  return (
    <div className="mt-6 pt-4 border-t border-border">
      <div className="flex items-center gap-2 text-xs font-semibold text-nearblack mb-1.5">
        <Globe size={15} className="text-primary shrink-0" />
        <span>Time zone</span>
      </div>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Select your time zone"
          className="w-full text-xs font-medium text-nearblack bg-white border border-border rounded-lg py-2 pl-3 pr-8 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer appearance-none"
        >
          {SUPPORTED_TIMEZONES.map((tz) => {
            const timeStr = formatInTimeZone(now, tz.value, "h:mmaaa");
            return (
              <option key={tz.value} value={tz.value}>
                {tz.label} ({timeStr})
              </option>
            );
          })}
        </select>
        <ChevronDown
          size={14}
          className="text-muted pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
        />
      </div>
    </div>
  );
}
