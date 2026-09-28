import { useState } from "react";
import type { FormEvent } from "react";
import { Plus, X } from "lucide-react";
import type { BookingFormData, FormErrors, TimeSlot } from "../../types/booking";
import { TextInput } from "../ui/TextInput";
import { RadioGroup } from "../ui/RadioGroup";
import { CheckboxGroup } from "../ui/CheckboxGroup";
import { Select } from "../ui/Select";
import { PhoneInput } from "../ui/PhoneInput";
import { Button } from "../ui/Button";
import { validateField, validateGuestEmail, validateAll } from "../../lib/validation";
import { QUESTIONS, QuestionOption } from "../../constants/questions";

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
  date: _date,
  slot: _slot,
  timezone: _timezone,
  formData,
  onUpdate,
  onBack: _onBack,
  onConfirm,
}: BookingFormProps) {
  const [errors, setErrors] = useState<FormErrors>({});
  const [guestInputVisible, setGuestInputVisible] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [guestError, setGuestError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

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

    const allErrors = validateAll(formData);
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      const firstKey = Object.keys(allErrors)[0];
      const targetElement =
        document.getElementById(firstKey) ||
        (document.querySelector(`[name="${firstKey}"]`) as HTMLElement | null);
      targetElement?.focus();
      return;
    }

    if (submitting) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    setSubmitting(false);
    onConfirm();
  };

  const errorEntries = Object.entries(errors).filter(([_, msg]) => !!msg);

  return (
    <div className="text-nearblack">
      <h2 className="text-lg font-bold text-nearblack mb-5">
        Enter Details
      </h2>

      {/* Live-region error summary */}
      {errorEntries.length > 0 && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 space-y-1"
        >
          <p className="font-semibold">Please fix the following errors:</p>
          <ul className="list-disc pl-4 space-y-0.5">
            {errorEntries.map(([field, msg]) => (
              <li key={field}>
                <button
                  type="button"
                  onClick={() => {
                    const el =
                      document.getElementById(field) ||
                      (document.querySelector(`[name="${field}"]`) as HTMLElement | null);
                    el?.focus();
                  }}
                  className="hover:underline text-left cursor-pointer"
                >
                  {msg}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {QUESTIONS.map((q) => {
          if (q.type === "name") {
            return (
              <div key={q.id} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextInput
                  id="firstName"
                  label="First name"
                  required
                  value={formData.firstName}
                  onChange={(e) => {
                    setField("firstName", e.target.value);
                    if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: undefined }));
                  }}
                  onBlur={() => blurField("firstName")}
                  error={errors.firstName}
                  autoComplete="given-name"
                />
                <TextInput
                  id="lastName"
                  label="Last name"
                  required
                  value={formData.lastName}
                  onChange={(e) => {
                    setField("lastName", e.target.value);
                    if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: undefined }));
                  }}
                  onBlur={() => blurField("lastName")}
                  error={errors.lastName}
                  autoComplete="family-name"
                />
              </div>
            );
          }

          if (q.type === "email") {
            return (
              <TextInput
                key={q.id}
                id="email"
                label={q.label}
                required={q.required}
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setField("email", e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                onBlur={() => blurField("email")}
                error={errors.email}
                autoComplete="email"
              />
            );
          }

          if (q.type === "guests") {
            return (
              <div key={q.id}>
                {formData.guests.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2.5">
                    {formData.guests.map((g) => (
                      <div
                        key={g}
                        className="inline-flex items-center gap-1.5 text-xs bg-primary-tint/80 border border-primary/20 text-primary px-3 py-1 rounded-full font-medium shadow-2xs"
                      >
                        <span>{g}</span>
                        <button
                          type="button"
                          onClick={() => removeGuest(g)}
                          aria-label={`Remove guest ${g}`}
                          className="hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {guestInputVisible ? (
                  <div className="flex gap-2 items-start animate-in fade-in duration-150">
                    <div className="flex-1">
                      <TextInput
                        id="guestEmail"
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addGuest();
                          }
                        }}
                        error={guestError}
                        autoFocus
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addGuest}
                      className="px-3.5 py-2.5 text-xs rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold transition-colors cursor-pointer shadow-xs"
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
                      aria-label="Cancel adding guest"
                      className="p-2.5 text-muted hover:text-nearblack transition-colors cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setGuestInputVisible(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary text-xs font-semibold text-primary hover:bg-primary-tint/50 transition-colors cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add guests</span>
                  </button>
                )}
              </div>
            );
          }

          if (q.type === "text") {
            return (
              <TextInput
                key={q.id}
                id="city"
                label={q.label}
                required={q.required}
                value={formData.city}
                onChange={(e) => {
                  setField("city", e.target.value);
                  if (errors.city) setErrors((prev) => ({ ...prev, city: undefined }));
                }}
                onBlur={() => blurField("city")}
                error={errors.city}
              />
            );
          }

          if (q.type === "radio") {
            return (
              <RadioGroup
                key={q.id}
                label={q.label}
                name="hometown"
                required={q.required}
                options={q.options || []}
                value={formData.hometown}
                error={errors.hometown}
                onChange={(v) => {
                  setField("hometown", v);
                  setErrors((prev) => ({ ...prev, hometown: undefined }));
                }}
                onBlur={() => blurField("hometown")}
              />
            );
          }

          if (q.type === "select") {
            return (
              <Select
                key={q.id}
                id="income"
                label={q.label}
                required={q.required}
                options={(q.options || []) as readonly QuestionOption[]}
                value={formData.income}
                onChange={(e) => {
                  setField("income", e.target.value);
                  setErrors((prev) => ({ ...prev, income: undefined }));
                }}
                onBlur={() => blurField("income")}
                error={errors.income}
              />
            );
          }

          if (q.type === "checkbox") {
            return (
              <CheckboxGroup
                key={q.id}
                label={q.label}
                name="landSize"
                required={q.required}
                options={(q.options || []) as readonly QuestionOption[]}
                values={formData.landSize}
                onChange={(v) => setField("landSize", v)}
              />
            );
          }

          if (q.type === "phone") {
            return (
              <PhoneInput
                key={q.id}
                id="whatsapp"
                label={q.label}
                required={q.required}
                value={formData.whatsapp}
                onChange={(e) => {
                  setField("whatsapp", e.target.value);
                  if (errors.whatsapp) setErrors((prev) => ({ ...prev, whatsapp: undefined }));
                }}
                onBlur={() => blurField("whatsapp")}
                error={errors.whatsapp}
              />
            );
          }

          return null;
        })}

        {/* Consent line */}
        <p className="text-xs text-muted leading-relaxed pt-1">
          By proceeding, you confirm that you have read and agree to Terms of Use and Privacy Notice.
        </p>

        {/* Submit Pill Button */}
        <div className="pt-2">
          <Button
            type="submit"
            fullWidth
            loading={submitting}
            className="w-full text-sm font-semibold bg-primary hover:bg-primary-hover text-white py-3 rounded-full cursor-pointer shadow-xs transition-colors"
          >
            {submitting ? "Scheduling…" : "Schedule Event"}
          </Button>
        </div>
      </form>
    </div>
  );
}
