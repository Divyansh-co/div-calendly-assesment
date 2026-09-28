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
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        aria-label="Back to calendar"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-primary transition-colors duration-150 mb-4 cursor-pointer"
      >
        <ChevronLeft size={16} />
        <span>Back</span>
      </button>

      <h2 className="text-lg font-bold text-nearblack mb-5">
        Enter Details
      </h2>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* First & Last name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput
            id="firstName"
            label="First name *"
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
            label="Last name *"
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

        {/* Email */}
        <TextInput
          id="email"
          label="Email *"
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

        {/* Add guests */}
        <div>
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
            <div className="flex gap-2 items-start">
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
                className="btn-primary px-3 py-2 text-xs shrink-0"
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
                className="p-2 text-muted hover:text-nearblack transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setGuestInputVisible(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              <Plus size={14} />
              Add guests
            </button>
          )}
        </div>

        {/* Which city are you based in? * */}
        <TextInput
          id="city"
          label="Which city are you based in? *"
          placeholder="e.g. Noida, Gurgaon, Delhi"
          value={formData.city}
          onChange={(e) => {
            setField("city", e.target.value);
            if (errors.city) setErrors((prev) => ({ ...prev, city: undefined }));
          }}
          onBlur={() => blurField("city")}
          error={errors.city}
        />

        {/* Where is your hometown? * */}
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

        {/* How much income do you make? * */}
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

        {/* How much land you want to buy? */}
        <CheckboxGroup
          label="How much land you want to buy?"
          name="landSize"
          options={LAND_SIZE_OPTIONS}
          values={formData.landSize}
          onChange={(v) => setField("landSize", v)}
        />

        {/* What is your whatsapp number? * */}
        <PhoneInput
          id="whatsapp"
          label="What is your whatsapp number? *"
          value={formData.whatsapp}
          onChange={(e) => {
            setField("whatsapp", e.target.value);
            if (errors.whatsapp) setErrors((prev) => ({ ...prev, whatsapp: undefined }));
          }}
          onBlur={() => blurField("whatsapp")}
          error={errors.whatsapp}
        />

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
