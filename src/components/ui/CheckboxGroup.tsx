
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
    <fieldset>
      <legend className="form-label">{label}</legend>
      <div className="flex flex-wrap gap-2 mt-1">
        {options.map((opt) => {
          const checked = values.includes(opt.value);
          const id = `${name}-${opt.value}`;
          return (
            <label
              key={opt.value}
              htmlFor={id}
              className={clsx(
                "flex items-center gap-2 cursor-pointer rounded-lg border px-3 py-2 text-sm transition-colors duration-150 select-none",
                checked
                  ? "border-primary bg-primary-tint text-navy-700 font-medium"
                  : "border-border bg-surface text-slate-500 hover:border-slate-300 hover:bg-bg"
              )}
            >
              <input
                type="checkbox"
                id={id}
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => toggle(opt.value)}
                className="w-4 h-4 accent-primary"
              />
              {opt.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
