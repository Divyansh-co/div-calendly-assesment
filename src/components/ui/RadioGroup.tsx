import { clsx } from "clsx";

interface Option {
  value: string;
  label: string;
}

interface RadioGroupProps {
  label: string;
  name: string;
  options: readonly string[] | readonly Option[];
  value: string;
  error?: string;
  required?: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

export function RadioGroup({
  label,
  name,
  options,
  value,
  error,
  required,
  onChange,
  onBlur,
}: RadioGroupProps) {
  const normalised: Option[] = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o
  );

  return (
    <fieldset className="space-y-1.5">
      <legend className="form-label">
        {label}
        {required && (
          <span className="text-red-500 ml-0.5" aria-hidden="true">
            *
          </span>
        )}
      </legend>
      <div className="grid grid-cols-1 gap-2.5 mt-1">
        {normalised.map((opt) => {
          const id = `${name}-${opt.value}`;
          const checked = value === opt.value;
          return (
            <label
              key={opt.value}
              htmlFor={id}
              className={clsx(
                "group flex items-center gap-3.5 cursor-pointer rounded-xl border p-3.5 text-sm transition-all duration-150 select-none shadow-2xs",
                checked
                  ? "border-primary bg-primary-tint/60 text-navy-900 font-semibold ring-1 ring-primary/30"
                  : "border-border bg-surface text-slate-700 hover:border-primary/40 hover:bg-primary-tint/20"
              )}
            >
              <input
                type="radio"
                id={id}
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
                onBlur={onBlur}
                className="sr-only"
              />
              <span
                className={clsx(
                  "w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all duration-150 ease-out",
                  checked
                    ? "border-primary bg-white ring-2 ring-primary/20"
                    : "border-slate-300 bg-white group-hover:border-primary/60"
                )}
                aria-hidden="true"
              >
                <span
                  className={clsx(
                    "w-2 h-2 rounded-full bg-primary transition-transform duration-150 ease-out",
                    checked ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  )}
                />
              </span>
              <span className="flex-1 text-sm font-medium">{opt.label}</span>
            </label>
          );
        })}
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
