
import { clsx } from "clsx";

interface Option {
  value: string;
  label: string;
}

interface RadioGroupProps {
  label: string;
  name: string;
  options: readonly string[] | Option[];
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

export function RadioGroup({
  label,
  name,
  options,
  value,
  error,
  onChange,
  onBlur,
}: RadioGroupProps) {
  const normalised: Option[] = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o
  );

  return (
    <fieldset className="space-y-1.5">
      <legend className="form-label">{label}</legend>
      <div className="grid grid-cols-1 gap-2.5 mt-1">
        {normalised.map((opt) => {
          const id = `${name}-${opt.value}`;
          const checked = value === opt.value;
          return (
            <label
              key={opt.value}
              htmlFor={id}
              className={clsx(
                "flex items-center gap-3 cursor-pointer rounded-xl border p-3.5 text-sm transition-all duration-150 select-none shadow-xs",
                checked
                  ? "border-primary bg-primary-tint/60 text-navy-900 font-semibold ring-1 ring-primary/40 shadow-xs"
                  : "border-border bg-surface text-slate-700 hover:border-slate-300 hover:bg-slate-50"
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
                className="w-4 h-4 text-primary accent-primary cursor-pointer focus:ring-primary"
              />
              <span className="flex-1">{opt.label}</span>
            </label>
          );
        })}
      </div>
      {error && (
        <p className="form-error mt-1.5" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
