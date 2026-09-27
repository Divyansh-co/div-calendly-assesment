import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { HOST_NAME, EVENT_TITLE, MEETING_DURATION_LABEL } from "../../constants/config";

const DESCRIPTION = `Before you book: this call is not with a land broker.

If the phrase "wealth multiplication through land" doesn't already make sense to you, please don't book — it'll save us both time.

**Who this is for**
Professionals who already earn well and have outgrown mutual funds or a standard flat. You're looking at physical agricultural land as a way to grow wealth faster.

**Who this isn't for**
You're looking for "get-rich-quick" schemes, risky trading tips, aren't ready to invest in solid long-term assets, or don't have capital to deploy within 30 days. This isn't for people who just want free advice or are window shopping.

**What we'll actually do on the call**
— Audit your current portfolio and find where your money is underperforming.
— Understand your goals and risk appetite, so any recommendation fits your actual situation.
— Walk through the land-investment model: how land is identified and secured in emerging areas.

**Logistics**
These calls are taken personally, so slots are limited. Please join on time, from somewhere quiet. A no-show requires a ₹5,000 rebooking fee.`;

function parseDescription(text: string) {
  return text.split("\n\n").map((para, i) => {
    if (para.startsWith("**") && para.includes("**\n")) {
      const [heading, ...rest] = para.split("\n");
      const headingText = heading.replace(/\*\*/g, "");
      return (
        <div key={i} className="mb-3">
          <p className="font-semibold text-navy-700 mb-1 text-sm">{headingText}</p>
          {rest.map((line, j) => (
            <p key={j} className="text-sm text-slate-500 leading-relaxed">
              {line}
            </p>
          ))}
        </div>
      );
    }
    return (
      <p key={i} className="text-sm text-slate-500 leading-relaxed mb-3">
        {para}
      </p>
    );
  });
}

export function EventDetails() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-5">
      {/* Host avatar placeholder */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-tint flex items-center justify-center shrink-0">
          <span className="text-primary font-bold text-sm">DM</span>
        </div>
        <span className="text-sm font-medium text-slate-500">{HOST_NAME}</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-navy-900 leading-snug tracking-tight">
          {EVENT_TITLE}
        </h1>
      </div>

      <div className="flex items-center gap-2 text-slate-500 text-sm">
        <span>🕐</span>
        <span>{MEETING_DURATION_LABEL}</span>
      </div>

      {/* Description with show more / less */}
      <div>
        <div
          className={`text-sm space-y-0 overflow-hidden transition-all duration-200 ${
            expanded ? "" : "max-h-20 relative"
          }`}
        >
          {!expanded && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          )}
          {parseDescription(DESCRIPTION)}
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover transition-colors duration-150"
          aria-expanded={expanded}
        >
          {expanded ? (
            <>
              Show less <ChevronUp size={14} />
            </>
          ) : (
            <>
              Show more <ChevronDown size={14} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
