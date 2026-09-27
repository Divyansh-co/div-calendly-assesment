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
      <div className="flex flex-col gap-1">
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
            "form-input",
            error && "border-error focus:border-error focus:ring-error/20",
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
