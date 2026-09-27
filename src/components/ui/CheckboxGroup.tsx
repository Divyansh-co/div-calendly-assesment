
import { clsx } from "clsx";

interface Option {
  value: string;
  label: string;
}

interface CheckboxGroupProps {
  label: string;
  name: string;
  options: Option[];
  values: string[];
  onChange: (values: string[]) => void;
}

export function CheckboxGroup({
  label,
  name,
  options,
  values,
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
      <legend className="form-label">{label}</legend>
      <div className="flex flex-wrap gap-2.5 mt-1">
        {options.map((opt) => {
          const checked = values.includes(opt.value);
          const id = `${name}-${opt.value}`;
          return (
            <label
              key={opt.value}
              htmlFor={id}
              className={clsx(
                "flex items-center gap-2.5 cursor-pointer rounded-xl border px-3.5 py-2.5 text-sm transition-all duration-150 select-none shadow-xs",
                checked
                  ? "border-primary bg-primary-tint/70 text-navy-900 font-semibold ring-1 ring-primary/30"
                  : "border-border bg-surface text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              <input
                type="checkbox"
                id={id}
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => toggle(opt.value)}
                className="w-4 h-4 rounded text-primary accent-primary cursor-pointer focus:ring-primary"
              />
              <span>{opt.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
