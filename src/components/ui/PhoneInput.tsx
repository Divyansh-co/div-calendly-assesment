import { forwardRef } from "react";
import type { InputHTMLAttributes, ChangeEvent } from "react";
import { clsx } from "clsx";

interface PhoneInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  id: string;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ label, error, id, className, onChange, ...rest }, ref) => {
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
          </label>
        )}
        <div
          className={clsx(
            "flex items-center rounded-xl border bg-surface overflow-hidden shadow-xs transition-all duration-150",
            error
              ? "border-error ring-1 ring-error"
              : "border-border hover:border-slate-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
          )}
        >
          {/* Locked prefix */}
          <span className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100/80 border-r border-border text-sm font-semibold text-navy-800 select-none shrink-0">
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
            placeholder="98765 43210"
            className={clsx(
              "flex-1 px-3.5 py-2.5 text-sm font-medium text-navy-900 placeholder:text-slate-400 focus:outline-none bg-transparent border-none",
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
