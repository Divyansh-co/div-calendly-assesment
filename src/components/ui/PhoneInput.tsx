import { forwardRef } from "react";
import type { InputHTMLAttributes, ChangeEvent } from "react";
import { clsx } from "clsx";

interface PhoneInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  id: string;
  required?: boolean;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ label, error, id, className, required, onChange, ...rest }, ref) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value.replace(/\D/g, "");
      // Handle pasting numbers copied with +91 or 0 prefix
      if (val.length === 12 && val.startsWith("91")) {
        val = val.slice(2);
      } else if (val.length === 11 && val.startsWith("0")) {
        val = val.slice(1);
      }
      e.target.value = val.slice(0, 10);
      onChange?.(e);
    };

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="form-label">
            {label}
            {required && (
              <span className="text-red-500 ml-0.5" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <div
          className={clsx(
            "flex items-center rounded-xl border bg-surface overflow-hidden transition-all duration-150 ease-out",
            error
              ? "border-error shadow-[0_0_0_3px_rgba(220,38,38,0.12)]"
              : "border-border hover:border-primary/40 focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(75,58,158,0.12)]"
          )}
        >
          <span className="flex items-center gap-1.5 px-3.5 py-2.5 bg-primary-tint/40 border-r border-border text-xs font-bold text-nearblack select-none shrink-0 tracking-wide">
            <span role="img" aria-label="India flag">🇮🇳</span>
            <span>+91</span>
          </span>
          <input
            ref={ref}
            id={id}
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={10}
            className={clsx(
              "flex-1 px-3.5 py-2.5 text-sm font-medium text-nearblack placeholder:text-muted focus:outline-none focus:ring-0 bg-transparent border-none",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            onChange={handleChange}
            {...rest}
          />
        </div>
        {error && (
          <p id={`${id}-error`} className="form-error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";
