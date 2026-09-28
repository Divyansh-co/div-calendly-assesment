import { useState } from "react";
import { Shield, Cookie, X, Check } from "lucide-react";

export function Footer() {
  const [activeModal, setActiveModal] = useState<"privacy" | "cookies" | null>(null);
  const [cookiesSaved, setCookiesSaved] = useState(false);

  const handleSaveCookies = () => {
    setCookiesSaved(true);
    setTimeout(() => {
      setCookiesSaved(false);
      setActiveModal(null);
    }, 600);
  };

  return (
    <div className="pt-4 mt-auto border-t border-border">
      <div className="flex items-center gap-3 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveModal("cookies")}
          className="text-blue-600 hover:underline cursor-pointer"
        >
          Cookie settings
        </button>
        <span className="text-muted" aria-hidden="true">•</span>
        <button
          type="button"
          onClick={() => setActiveModal("privacy")}
          className="text-blue-600 hover:underline cursor-pointer"
        >
          Privacy Policy
        </button>
      </div>

      {activeModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs text-left"
        >
          <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-xl space-y-4 border border-butter-border">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                {activeModal === "privacy" && <Shield className="text-primary" size={18} />}
                {activeModal === "cookies" && <Cookie className="text-primary" size={18} />}
                <h3 className="text-sm font-bold text-nearblack">
                  {activeModal === "privacy" && "Privacy Policy"}
                  {activeModal === "cookies" && "Cookie Settings"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                aria-label="Close dialog"
                className="p-1 rounded-lg text-muted hover:text-nearblack hover:bg-butter-light transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="text-xs text-[#4A4A4A] space-y-2.5 leading-relaxed">
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
                  <div className="p-3 bg-butter-light/40 rounded-xl border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-nearblack">Essential Session State</span>
                      <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wide">Always Active</span>
                    </div>
                    <p className="text-[11px] text-muted">
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
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold cursor-pointer shadow-xs inline-flex items-center gap-1.5 transition-colors"
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
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
