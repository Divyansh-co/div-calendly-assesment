import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold text-sm rounded-lg transition-colors duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed select-none";

  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary-hover active:bg-primary-hover disabled:bg-slate-300 disabled:text-white",
    outline:
      "border border-border text-slate-500 bg-surface hover:bg-bg hover:border-slate-300 disabled:opacity-50",
    ghost:
      "text-primary hover:bg-primary-tint disabled:opacity-50",
  };

  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={clsx(
        base,
        variants[variant],
        fullWidth && "w-full",
        "px-6 py-3",
        className
      )}
      style={{ minHeight: 48, ...(rest.style ?? {}) }}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12" cy="12" r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
