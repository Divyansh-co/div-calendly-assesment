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
      // Strip non-digits before passing up
      e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
      onChange?.(e);
    };

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={id} className="form-label">
            {label}
          </label>
        )}
        <div
          className={clsx(
            "flex items-center rounded-lg border bg-surface overflow-hidden transition-colors duration-150",
            error ? "border-error" : "border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
          )}
        >
          {/* Locked prefix */}
          <span className="flex items-center gap-1.5 px-3 py-2.5 bg-bg border-r border-border text-sm text-slate-500 select-none shrink-0">
            🇮🇳 +91
          </span>
          <input
            ref={ref}
            id={id}
            type="tel"
            inputMode="numeric"
            maxLength={10}
            className={clsx(
              "flex-1 px-3 py-2.5 text-sm text-navy-700 placeholder:text-slate-300 focus:outline-none bg-transparent",
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
