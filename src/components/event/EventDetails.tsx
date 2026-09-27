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
      {/* Host avatar brand mark */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white font-bold text-base shadow-sm ring-4 ring-primary/10 select-none shrink-0">
          DM
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Host</span>
          <span className="text-sm font-semibold text-navy-900">{HOST_NAME}</span>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-navy-900 leading-snug tracking-tight">
          {EVENT_TITLE}
        </h1>
      </div>

      {/* High-contrast duration badge */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/90 text-navy-800 text-xs font-semibold shadow-xs">
          <Clock size={14} className="text-primary shrink-0" />
          <span>{MEETING_DURATION_LABEL}</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-primary-tint/70 text-primary text-xs font-medium border border-primary/20">
          1-on-1 Consultation
        </span>
      </div>

      {/* Description with structured sections and subtle dividers */}
      <div>
        <div
          className={`text-sm space-y-4 overflow-hidden transition-all duration-200 ${
            expanded ? "" : "max-h-[140px] relative"
          }`}
        >
          {!expanded && (
            <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-surface via-surface/90 to-transparent pointer-events-none" />
          )}

          <div className="space-y-2">
            <p className="text-sm font-medium text-navy-900">
              Before you book: this call is not with a land broker.
            </p>
            <p className="text-sm text-slate-500 leading-relaxed">
              If the phrase "wealth multiplication through land" doesn't already make sense to you, please don't book — it'll save us both time.
            </p>
          </div>

          {/* Section: Who this is for */}
          <div className="border-t border-border pt-3.5 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs uppercase tracking-wide">
              <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
              <span>Who this is for</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed pl-5">
              Professionals who already earn well and have outgrown mutual funds or a standard flat. You're looking at physical agricultural land as a way to grow wealth faster.
            </p>
          </div>

          {/* Section: Who this isn't for */}
          <div className="border-t border-border pt-3.5 space-y-1.5">
            <div className="flex items-center gap-2 text-rose-700 font-semibold text-xs uppercase tracking-wide">
              <XCircle size={14} className="text-rose-600 shrink-0" />
              <span>Who this isn't for</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed pl-5">
              You're looking for "get-rich-quick" schemes, risky trading tips, aren't ready to invest in solid long-term assets, or don't have capital to deploy within 30 days. This isn't for people who just want free advice or are window shopping.
            </p>
          </div>

          {/* Section: What we'll do */}
          <div className="border-t border-border pt-3.5 space-y-1.5">
            <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wide">
              <ListChecks size={14} className="text-primary shrink-0" />
              <span>What we'll actually do on the call</span>
            </div>
            <ul className="text-sm text-slate-600 space-y-1 pl-5 list-disc list-inside">
              <li>Audit your current portfolio and find where your money is underperforming.</li>
              <li>Understand your goals and risk appetite, so any recommendation fits your actual situation.</li>
              <li>Walk through the land-investment model: how land is identified and secured in emerging areas.</li>
            </ul>
          </div>

          {/* Section: Logistics */}
          <div className="border-t border-border pt-3.5 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-700 font-semibold text-xs uppercase tracking-wide">
              <AlertCircle size={14} className="text-amber-600 shrink-0" />
              <span>Logistics</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed pl-5">
              These calls are taken personally, so slots are limited. Please join on time, from somewhere quiet. A no-show requires a ₹5,000 rebooking fee.
            </p>
          </div>
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover transition-colors duration-150"
          aria-expanded={expanded}
        >
          {expanded ? (
            <>
              Show less <ChevronUp size={14} />
            </>
          ) : (
            <>
              Show more details <ChevronDown size={14} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
