import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  XCircle,
  ListChecks,
  AlertCircle,
} from "lucide-react";
import { HOST_NAME, EVENT_TITLE, MEETING_DURATION_LABEL } from "../../constants/config";

export function EventDetails() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3.5">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base ring-4 ring-primary/10 select-none shrink-0"
          style={{ background: "radial-gradient(135deg, #3B82F6 0%, #2563EB 45%, #1D4ED8 100%)", boxShadow: "0 2px 8px rgba(37,99,235,0.35)" }}
        >
          DM
        </div>
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
            Host
          </span>
          <span className="text-base font-bold text-navy-900 tracking-tight">
            {HOST_NAME}
          </span>
        </div>
      </div>

      <div>
        <h1 className="text-2xl sm:text-[26px] font-extrabold text-navy-900 leading-[1.2] tracking-tight">
          {EVENT_TITLE}
        </h1>
      </div>

      <div className="flex items-center gap-2.5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-navy-900 text-xs font-semibold shadow-2xs">
          <Clock size={14} className="text-primary shrink-0" />
          <span>{MEETING_DURATION_LABEL}</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-primary-tint/80 text-primary text-xs font-semibold border border-primary/20">
          1-on-1 Strategy Call
        </span>
      </div>

      <div>
        <div
          className={`text-sm space-y-4 overflow-hidden transition-all duration-200 ${
            expanded ? "" : "max-h-[140px] relative"
          }`}
        >
          {!expanded && (
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50/90 via-slate-50/70 to-transparent pointer-events-none" />
          )}

          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-navy-900 leading-snug">
              Before you book: this call is not with a land broker.
            </p>
            <p className="text-[13.5px] font-normal text-slate-500 leading-[1.6]">
              If the phrase "wealth multiplication through land" doesn't already make sense to you, please don't book — it'll save us both time.
            </p>
          </div>

          <div className="border-t border-border pt-3.5 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs uppercase tracking-wider">
              <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
              <span>Who this is for</span>
            </div>
            <p className="text-[13.5px] font-normal text-slate-600 leading-[1.6] pl-5">
              Professionals who already earn well and have outgrown mutual funds or a standard flat. You're looking at physical agricultural land as a way to grow wealth faster.
            </p>
          </div>

          <div className="border-t border-border pt-3.5 space-y-1.5">
            <div className="flex items-center gap-2 text-rose-700 font-semibold text-xs uppercase tracking-wider">
              <XCircle size={14} className="text-rose-600 shrink-0" />
              <span>Who this isn't for</span>
            </div>
            <p className="text-[13.5px] font-normal text-slate-600 leading-[1.6] pl-5">
              You're looking for "get-rich-quick" schemes, risky trading tips, aren't ready to invest in solid long-term assets, or don't have capital to deploy within 30 days. This isn't for people who just want free advice or are window shopping.
            </p>
          </div>

          <div className="border-t border-border pt-3.5 space-y-1.5">
            <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
              <ListChecks size={14} className="text-primary shrink-0" />
              <span>What we'll actually do on the call</span>
            </div>
            <ul className="text-[13.5px] font-normal text-slate-600 space-y-1.5 pl-5 list-disc list-inside leading-[1.6]">
              <li>Audit your current portfolio and find where your money is underperforming.</li>
              <li>Understand your goals and risk appetite, so any recommendation fits your actual situation.</li>
              <li>Walk through the land-investment model: how land is identified and secured in emerging areas.</li>
            </ul>
          </div>

          <div className="border-t border-border pt-3.5 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-700 font-semibold text-xs uppercase tracking-wider">
              <AlertCircle size={14} className="text-amber-600 shrink-0" />
              <span>Logistics</span>
            </div>
            <p className="text-[13.5px] font-normal text-slate-600 leading-[1.6] pl-5">
              These calls are taken personally, so slots are limited. Please join on time, from somewhere quiet. A no-show requires a ₹5,000 rebooking fee.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover transition-colors duration-150 group"
          aria-expanded={expanded}
        >
          <span>{expanded ? "Show less" : "Show more details"}</span>
          {expanded ? (
            <ChevronUp size={13} className="transition-transform group-hover:-translate-y-0.5" />
          ) : (
            <ChevronDown size={13} className="transition-transform group-hover:translate-y-0.5" />
          )}
        </button>
      </div>
    </div>
  );
}
