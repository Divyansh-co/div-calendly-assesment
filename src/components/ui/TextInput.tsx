import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { clsx } from "clsx";
import { FIELD_MAX_LENGTHS } from "../../lib/validation";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  id: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, id, className, maxLength, ...rest }, ref) => {
    // Fall back to the shared max-length map so limits are enforced at the DOM level
    // even if the caller forgets to pass maxLength explicitly.
    const resolvedMax = maxLength ?? FIELD_MAX_LENGTHS[id];

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="form-label">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          maxLength={resolvedMax}
          className={clsx(
            "w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm font-medium text-navy-900 placeholder:text-slate-400 transition-all duration-150 ease-out",
            "focus:outline-none focus:ring-0",
            error
              ? "border-error focus:border-error focus:shadow-[0_0_0_3px_rgba(220,38,38,0.12)]"
              : "border-border hover:border-slate-300 focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)]",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...rest}
        />
        {error && (
          <p id={`${id}-error`} className="form-error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";
