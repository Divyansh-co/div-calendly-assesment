/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0B1F33",
          800: "#0F172A",
          700: "#1E293B",
        },
        slate: {
          300: "#94A3B8",
          400: "#64748B",
          500: "#475569",
        },
        border: "#E2E8F0",
        bg: "#F8FAFC",
        surface: "#FFFFFF",
        primary: {
          DEFAULT: "#2563EB",
          hover: "#1D4ED8",
          tint: "#EFF6FF",
        },
        success: "#16A34A",
        error: "#DC2626",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,23,42,0.04), 0 4px 12px rgba(15,23,42,0.06)",
        "2xs": "0 1px 2px rgba(15,23,42,0.03)",
        xs: "0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.03)",
        sm: "0 1px 2px 0 rgba(15, 23, 42, 0.05)",
        md: "0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)",
        lift: "0 4px 12px rgba(37,99,235,0.12), 0 1px 3px rgba(15,23,42,0.06)",
      },
      spacing: {
        "4.5": "1.125rem",  // 18px — used by BookingSummary padding
        "18": "4.5rem",    // 72px
        "22": "5.5rem",    // 88px
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
