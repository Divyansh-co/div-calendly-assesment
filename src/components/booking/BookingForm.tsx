import { useState } from "react";
import type { FormEvent } from "react";
import { ChevronLeft, Plus, X, Shield, FileText } from "lucide-react";
import type { BookingFormData, FormErrors, TimeSlot } from "../../types/booking";
import { TextInput } from "../ui/TextInput";
import { RadioGroup } from "../ui/RadioGroup";
import { CheckboxGroup } from "../ui/CheckboxGroup";
import { Select } from "../ui/Select";
import { PhoneInput } from "../ui/PhoneInput";
import { Button } from "../ui/Button";
import { BookingSummary } from "./BookingSummary";
import { validateField, validateGuestEmail, validateAll } from "../../lib/validation";
import {
  HOMETOWN_OPTIONS,
  INCOME_OPTIONS,
  LAND_SIZE_OPTIONS,
} from "../../constants/config";

interface BookingFormProps {
  date: Date;
  slot: TimeSlot;
  timezone: string;
  formData: BookingFormData;
  onUpdate: (data: Partial<BookingFormData>) => void;
  onBack: () => void;
  onConfirm: () => void;
}

export function BookingForm({
  date,
  slot,
  timezone,
  formData,
  onUpdate,
  onBack,
  onConfirm,
}: BookingFormProps) {
  const [errors, setErrors] = useState<FormErrors>({});
  const [guestInputVisible, setGuestInputVisible] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [guestError, setGuestError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [activeModal, setActiveModal] = useState<"terms" | "privacy" | null>(null);

  // Honeypot field — must remain empty.
  const [honeypot, setHoneypot] = useState("");

  const setField = <K extends keyof BookingFormData>(
    field: K,
    value: BookingFormData[K]
  ) => {
    onUpdate({ [field]: value });
  };

  const blurField = (field: keyof BookingFormData) => {
    const err = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const addGuest = () => {
    const err = validateGuestEmail(guestEmail);
    if (err) {
      setGuestError(err);
      return;
    }
    if (!formData.guests.includes(guestEmail.trim())) {
      setField("guests", [...formData.guests, guestEmail.trim()]);
    }
    setGuestEmail("");
    setGuestInputVisible(false);
    setGuestError(undefined);
  };

  const removeGuest = (email: string) => {
    setField("guests", formData.guests.filter((g) => g !== email));
  };

  // Check if all required fields are filled and valid
  const currentValidationErrors = validateAll(formData);
  const isFormValid =
    Boolean(formData.firstName.trim()) &&
    Boolean(formData.lastName.trim()) &&
    Boolean(formData.email.trim()) &&
    Boolean(formData.city.trim()) &&
    Boolean(formData.hometown) &&
    Boolean(formData.income) &&
    formData.whatsapp.trim().length === 10 &&
    Object.keys(currentValidationErrors).length === 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Honeypot check — silent rejection
    if (honeypot) return;

    // Re-validate everything on submit
    const allErrors = validateAll(formData);
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      const firstKey = Object.keys(allErrors)[0];
      document.getElementById(firstKey)?.focus();
      return;
    }

    if (submitting) return;

    setSubmitting(true);
    // Simulated async submission (~800ms)
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    onConfirm();
  };

  const handleDisabledSubmitClick = () => {
    if (!isFormValid && !submitting) {
      const allErrors = validateAll(formData);
      setErrors(allErrors);
      const firstKey = Object.keys(allErrors)[0];
      if (firstKey) {
        document.getElementById(firstKey)?.focus();
      }
    }
  };

  return (
    <div className="step-enter">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back to time selection"
        className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-navy-900 transition-colors duration-150 mb-5 group"
      >
        <ChevronLeft size={16} className="text-slate-400 group-hover:text-primary transition-colors" />
        Back to time selection
      </button>

      <BookingSummary date={date} slot={slot} timezone={timezone} />

      <form onSubmit={handleSubmit} noValidate aria-live="polite">
        {/* Honeypot field */}
        <div
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}
        >
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <div className="space-y-6">
          {/* Name row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              id="firstName"
              label="First name *"
              placeholder="Rahul"
              value={formData.firstName}
              onChange={(e) => setField("firstName", e.target.value)}
              onBlur={() => blurField("firstName")}
              error={errors.firstName}
              autoComplete="given-name"
            />
            <TextInput
              id="lastName"
              label="Last name *"
              placeholder="Sharma"
              value={formData.lastName}
              onChange={(e) => setField("lastName", e.target.value)}
              onBlur={() => blurField("lastName")}
              error={errors.lastName}
              autoComplete="family-name"
            />
          </div>

          <TextInput
            id="email"
            label="Email *"
            type="email"
            placeholder="rahul@example.com"
            value={formData.email}
            onChange={(e) => setField("email", e.target.value)}
            onBlur={() => blurField("email")}
            error={errors.email}
            autoComplete="email"
          />

          {/* Guest emails */}
          <div>
            {formData.guests.map((g) => (
              <div key={g} className="flex items-center gap-2 text-sm text-navy-800 bg-slate-50 border border-border px-3 py-1.5 rounded-lg mb-2">
                <span className="flex-1 truncate font-medium">{g}</span>
                <button
                  type="button"
                  onClick={() => removeGuest(g)}
                  aria-label={`Remove guest ${g}`}
                  className="text-slate-400 hover:text-error transition-colors p-1"
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            {guestInputVisible ? (
              <div className="flex gap-2">
                <TextInput
                  id="guestEmail"
                  placeholder="colleague@example.com"
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  onBlur={() => {
                    if (guestEmail) setGuestError(validateGuestEmail(guestEmail));
                  }}
                  error={guestError}
                  className="flex-1"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={addGuest}
                  className="shrink-0 px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary-hover transition-colors shadow-xs"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGuestInputVisible(false);
                    setGuestEmail("");
                    setGuestError(undefined);
                  }}
                  className="shrink-0 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setGuestInputVisible(true)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover transition-colors mt-1 p-1"
              >
                <Plus size={16} />
                Add guests
              </button>
            )}
          </div>

          <TextInput
            id="city"
            label="Which city are you based in? *"
            placeholder="e.g. Noida, Gurgaon, Delhi"
            value={formData.city}
            onChange={(e) => setField("city", e.target.value)}
            onBlur={() => blurField("city")}
            error={errors.city}
          />

          <RadioGroup
            label="Where is your hometown? *"
            name="hometown"
            options={HOMETOWN_OPTIONS}
            value={formData.hometown}
            error={errors.hometown}
            onChange={(v) => {
              setField("hometown", v);
              setErrors((prev) => ({ ...prev, hometown: undefined }));
            }}
            onBlur={() => blurField("hometown")}
          />

          <Select
            id="income"
            label="How much income do you make? *"
            options={INCOME_OPTIONS}
            value={formData.income}
            onChange={(e) => {
              setField("income", e.target.value);
              setErrors((prev) => ({ ...prev, income: undefined }));
            }}
            onBlur={() => blurField("income")}
            error={errors.income}
          />

          <CheckboxGroup
            label="How much land you want to buy? (Optional)"
            name="landSize"
            options={LAND_SIZE_OPTIONS}
            values={formData.landSize}
            onChange={(v) => setField("landSize", v)}
          />

          <PhoneInput
            id="whatsapp"
            label="What is your WhatsApp number? *"
            value={formData.whatsapp}
            onChange={(e) => setField("whatsapp", e.target.value)}
            onBlur={() => blurField("whatsapp")}
            error={errors.whatsapp}
          />

          <p className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-border/80">
            By proceeding, you confirm that you have read and agree to Divyansh Mishra's{" "}
            <button
              type="button"
              onClick={() => setActiveModal("terms")}
              className="font-semibold text-primary hover:underline focus:outline-none"
            >
              Participant Terms
            </button>{" "}
            and{" "}
            <button
              type="button"
              onClick={() => setActiveModal("privacy")}
              className="font-semibold text-primary hover:underline focus:outline-none"
            >
              Privacy Notice
            </button>
            .
          </p>

          {/* Schedule Event button with disabled-until-valid behavior */}
          <div onClick={handleDisabledSubmitClick} className="w-full">
            <Button
              type="submit"
              fullWidth
              loading={submitting}
              disabled={!isFormValid || submitting}
              className="mt-2 text-base font-semibold shadow-sm"
            >
              {submitting ? "Scheduling…" : "Schedule Event"}
            </Button>
          </div>
          {!isFormValid && (
            <p className="text-xs text-slate-400 text-center font-medium">
              Please complete all required fields (*) to schedule your appointment
            </p>
          )}
        </div>
      </form>

      {/* Terms & Privacy Modals */}
      {activeModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="card w-full max-w-lg p-6 bg-surface shadow-lg space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                {activeModal === "terms" ? (
                  <FileText className="text-primary" size={20} />
                ) : (
                  <Shield className="text-primary" size={20} />
                )}
                <h3 className="text-base font-bold text-navy-900">
                  {activeModal === "terms" ? "Participant Terms" : "Privacy Notice"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                aria-label="Close modal"
                className="p-1 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="text-sm text-slate-600 space-y-3 leading-relaxed">
              {activeModal === "terms" ? (
                <>
                  <p>
                    <strong>1. Scope of Consultation:</strong> This appointment is a private, 1-on-1 strategy consultation on agricultural land investment frameworks. It does not constitute formal real estate brokerage or legal advisory.
                  </p>
                  <p>
                    <strong>2. Punctuality & Attendance:</strong> Slots are strictly reserved. Attendees must join within 5 minutes of scheduled start time. Missed sessions without 24 hours prior notice require a ₹5,000 rescheduling fee.
                  </p>
                  <p>
                    <strong>3. Readiness:</strong> Attendees acknowledge that investments discussed require active capital deployment within 30 days and genuine investment interest.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>1. Information Collection:</strong> We collect your name, email, phone number, and investment preferences solely for scheduling and conducting your consultation call.
                  </p>
                  <p>
                    <strong>2. Zero Tracking / Zero Sale:</strong> Your personal data is never sold, leased, or shared with third-party marketers or brokers.
                  </p>
                  <p>
                    <strong>3. Retention:</strong> Details are stored strictly in memory for this session and can be purged upon request.
                  </p>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-border flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="btn-primary px-5 py-2 min-h-0 text-xs font-semibold"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
