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
      document.getElementById(firstKey)?.focus();
      return;
    }

    if (submitting) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    setSubmitting(false);
    onConfirm();
  };

  return (
    <div className="text-nearblack">
      <h2 className="text-lg font-bold text-nearblack mb-5">
        Enter Details
      </h2>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {QUESTIONS.map((q) => {
          if (q.type === "name") {
            return (
              <div key={q.id} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextInput
                  id="firstName"
                  label="First name"
                  required
                  placeholder="Rahul"
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
                  placeholder="Sharma"
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
                placeholder="rahul@example.com"
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
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.guests.map((g) => (
                      <div
                        key={g}
                        className="inline-flex items-center gap-1.5 text-xs bg-primary-tint border border-primary/20 text-primary px-2.5 py-1 rounded-full font-medium"
                      >
                        <span>{g}</span>
                        <button
                          type="button"
                          onClick={() => removeGuest(g)}
                          aria-label={`Remove guest ${g}`}
                          className="hover:text-error transition-colors"
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
                        placeholder="colleague@example.com"
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
                placeholder="e.g. Noida, Gurgaon, Delhi"
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

        {/* Submit Button */}
        <div className="pt-3">
          <Button
            type="submit"
            fullWidth
            loading={submitting}
            className="w-full text-base font-bold bg-primary hover:bg-primary-hover text-white py-3 rounded-lg"
          >
            {submitting ? "Scheduling…" : "Schedule Event"}
          </Button>
        </div>
      </form>
    </div>
  );
}
