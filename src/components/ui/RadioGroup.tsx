
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
    <fieldset>
      <legend className="form-label">{label}</legend>
      <div className="flex flex-col gap-2.5 mt-1">
        {normalised.map((opt) => {
          const id = `${name}-${opt.value}`;
          const checked = value === opt.value;
          return (
            <label
              key={opt.value}
              htmlFor={id}
              className={clsx(
                "flex items-center gap-3 cursor-pointer rounded-lg border px-3 py-2.5 text-sm transition-colors duration-150",
                checked
                  ? "border-primary bg-primary-tint text-navy-700 font-medium"
                  : "border-border bg-surface text-slate-500 hover:border-slate-300 hover:bg-bg"
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
                className="w-4 h-4 accent-primary"
              />
              {opt.label}
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
