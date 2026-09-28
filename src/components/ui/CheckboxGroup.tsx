import { clsx } from "clsx";

interface Option {
  value: string;
  label: string;
}

interface CheckboxGroupProps {
  label: string;
  name: string;
  options: readonly Option[];
  values: string[];
  required?: boolean;
  onChange: (values: string[]) => void;
}

export function CheckboxGroup({
  label,
  name,
  options,
  values,
  required,
  onChange,
}: CheckboxGroupProps) {
  const toggle = (val: string) => {
    const next = values.includes(val)
      ? values.filter((v) => v !== val)
      : [...values, val];
    onChange(next);
  };

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
      <div className="flex flex-wrap gap-2.5 mt-1">
        {options.map((opt) => {
          const checked = values.includes(opt.value);
          const id = `${name}-${opt.value}`;
          return (
            <label
              key={opt.value}
              htmlFor={id}
              className={clsx(
                "group flex items-center gap-2.5 cursor-pointer rounded-xl border px-3.5 py-2.5 text-sm transition-all duration-150 select-none shadow-2xs",
                checked
                  ? "border-primary bg-primary-tint/70 text-nearblack font-semibold ring-1 ring-primary/30"
                  : "border-border bg-surface text-nearblack hover:border-primary/40 hover:bg-primary-tint/20"
              )}
            >
              <input
                type="checkbox"
                id={id}
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => toggle(opt.value)}
                className="sr-only"
              />
              <span
                className={clsx(
                  "w-4 h-4 rounded-[5px] border flex items-center justify-center shrink-0 transition-all duration-150 ease-out",
                  checked
                    ? "bg-primary border-primary text-white shadow-2xs"
                    : "bg-white border-border group-hover:border-primary/60"
                )}
                aria-hidden="true"
              >
                <svg
                  className={clsx(
                    "w-2.5 h-2.5 text-white transition-all duration-150 ease-out",
                    checked ? "scale-100 opacity-100" : "scale-50 opacity-0"
                  )}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span className="text-sm font-medium">{opt.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
