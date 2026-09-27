import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";
import { clsx } from "clsx";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  id: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, id, className, ...rest }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={id}
          className={clsx(
            "w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm font-medium text-navy-900 appearance-none pr-10 cursor-pointer transition-all duration-150 ease-out",
            "focus:outline-none focus:ring-0",
            error
              ? "border-error focus:border-error focus:shadow-[0_0_0_3px_rgba(220,38,38,0.12)]"
              : "border-border hover:border-slate-300 focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)]",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...rest}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} disabled={o.value === ""}>
              {o.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
      {error && (
        <p id={`${id}-error`} className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
);

Select.displayName = "Select";
