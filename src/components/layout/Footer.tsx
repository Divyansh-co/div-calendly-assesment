

import { useState } from "react";
import { Shield, FileText, Cookie, X, Check } from "lucide-react";

export function Footer() {
  const [activeModal, setActiveModal] = useState<"terms" | "privacy" | "cookies" | null>(null);
  const [cookiesSaved, setCookiesSaved] = useState(false);

  const handleSaveCookies = () => {
    setCookiesSaved(true);
    setTimeout(() => {
      setCookiesSaved(false);
      setActiveModal(null);
    }, 600);
  };

  return (
    <footer className="py-8 text-center border-t border-border/60 bg-surface/40 mt-auto">
      <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <p className="select-none">
          Scheduling by <span className="font-semibold text-navy-800">Divyansh Mishra</span>
        </p>

        <div className="flex items-center gap-4 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveModal("terms")}
            className="text-slate-500 hover:text-primary transition-colors"
          >
            Terms of Service
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setActiveModal("privacy")}
            className="text-slate-500 hover:text-primary transition-colors"
          >
            Privacy Notice
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setActiveModal("cookies")}
            className="text-slate-500 hover:text-primary transition-colors"
          >
            Cookie Preferences
          </button>
        </div>
      </div>

      {/* Footer Modals */}
      {activeModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-xs text-left"
        >
          <div className="card w-full max-w-md p-6 bg-surface shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                {activeModal === "terms" && <FileText className="text-primary" size={18} />}
                {activeModal === "privacy" && <Shield className="text-primary" size={18} />}
                {activeModal === "cookies" && <Cookie className="text-primary" size={18} />}
                <h3 className="text-sm font-bold text-navy-900">
                  {activeModal === "terms" && "Terms of Service"}
                  {activeModal === "privacy" && "Privacy Notice"}
                  {activeModal === "cookies" && "Cookie Preferences"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                aria-label="Close dialog"
                className="p-1 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
              {activeModal === "terms" && (
                <>
                  <p>
                    All consultations with Divyansh Mishra are scheduled for private informational and strategy discussions regarding agricultural land investment principles.
                  </p>
                  <p>
                    Cancellations or rescheduling requests should be submitted at least 24 hours prior to the booked time slot.
                  </p>
                </>
              )}

              {activeModal === "privacy" && (
                <>
                  <p>
                    We respect your privacy. Contact details provided during booking (name, email, phone number) are utilized strictly for appointment reminders and calendar coordination.
                  </p>
                  <p>
                    No tracking cookies, marketing pixels, or third-party advertising scripts are installed or loaded on this site.
                  </p>
                </>
              )}

              {activeModal === "cookies" && (
                <>
                  <p className="mb-3">
                    This website only uses strictly necessary local state to maintain your booking session. No third-party tracking cookies are used.
                  </p>
                  <div className="p-3 bg-slate-50 rounded-xl border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-navy-900">Essential Session State</span>
                      <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wide">Always Active</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Required for step transitions, calendar date selection, and appointment confirmations.
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-border flex justify-end gap-2">
              {activeModal === "cookies" ? (
                <button
                  type="button"
                  onClick={handleSaveCookies}
                  className="btn-primary px-4 py-2 min-h-0 text-xs font-semibold"
                >
                  {cookiesSaved ? (
                    <>
                      <Check size={14} /> Saved
                    </>
                  ) : (
                    "Save Preferences"
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="btn-primary px-4 py-2 min-h-0 text-xs font-semibold"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
