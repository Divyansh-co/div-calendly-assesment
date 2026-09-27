import { useState } from "react";
import type { FormEvent } from "react";
import { ChevronLeft, Plus, X } from "lucide-react";
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

  // Honeypot field — must remain empty. Bots that auto-fill all fields will
  // populate this and be silently rejected. A real backend should also check
  // this server-side and enforce rate limiting per IP/email/phone.
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Honeypot check — silent rejection; never reveal the reason to the submitter.
    if (honeypot) return;

    // Re-validate everything on submit regardless of prior blur state.
    // This is the definitive gate before any data is processed.
    const allErrors = validateAll(formData);
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      const firstKey = Object.keys(allErrors)[0];
      document.getElementById(firstKey)?.focus();
      return;
    }

    // Guard against double-submission (button also disables, but this is a belt+suspenders check).
    if (submitting) return;

    setSubmitting(true);
    // Simulated async submission (~800ms).
    // NOTE: No PII is logged here. In a real integration, errors from the API
    // should show a generic user-facing message only — never log raw field values.
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    onConfirm();
  };

  return (
    <div className="step-enter">
      <button
        onClick={onBack}
        aria-label="Back to time selection"
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-700 transition-colors duration-150 mb-5"
      >
        <ChevronLeft size={16} />
        Back
      </button>

      <BookingSummary date={date} slot={slot} timezone={timezone} />

      <form onSubmit={handleSubmit} noValidate aria-live="polite">
        {/*
          Honeypot field — hidden from real users via CSS (not `display:none` which
          some bots detect and skip). If populated, submission is rejected silently.
          TODO (backend): also validate this server-side before persisting any data.
        */}
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

        <div className="space-y-5">
          {/* Name row — stacked on mobile, side-by-side on sm+ */}
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
              <div key={g} className="flex items-center gap-2 text-sm text-slate-500 mb-1.5">
                <span className="flex-1 truncate">{g}</span>
                <button
                  type="button"
                  onClick={() => removeGuest(g)}
                  aria-label={`Remove guest`}
                  className="text-slate-300 hover:text-error transition-colors duration-150"
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            {guestInputVisible ? (
              <div className="flex gap-2">
                <TextInput
                  id="guestEmail"
                  placeholder="guest@example.com"
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
                  className="shrink-0 px-3 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-hover transition-colors duration-150"
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
                  className="shrink-0 p-2 text-slate-300 hover:text-slate-500 transition-colors duration-150"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setGuestInputVisible(true)}
                className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover transition-colors duration-150 mt-1"
              >
                <Plus size={14} />
                Add guests
              </button>
            )}
          </div>

          <TextInput
            id="city"
            label="Which city are you based in? *"
            placeholder="e.g. Noida"
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
            label="How much land you want to buy?"
            name="landSize"
            options={LAND_SIZE_OPTIONS}
            values={formData.landSize}
            onChange={(v) => setField("landSize", v)}
          />

          <PhoneInput
            id="whatsapp"
            label="What is your WhatsApp number? *"
            placeholder="9876543210"
            value={formData.whatsapp}
            onChange={(e) => setField("whatsapp", e.target.value)}
            onBlur={() => blurField("whatsapp")}
            error={errors.whatsapp}
          />

          <p className="text-xs text-slate-500 leading-relaxed">
            By proceeding, you confirm that you have read and agree to Divyansh Mishra's{" "}
            <a href="#" className="text-primary hover:underline">
              Participant Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:underline">
              Privacy Notice
            </a>
            .
          </p>

          <Button
            type="submit"
            fullWidth
            loading={submitting}
            disabled={submitting}
            className="mt-2"
          >
            {submitting ? "Scheduling…" : "Schedule Event"}
          </Button>
        </div>
      </form>
    </div>
  );
}
