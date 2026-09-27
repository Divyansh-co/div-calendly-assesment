/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0B1F33",
          700: "#0F172A",
        },
        slate: {
          300: "#94A3B8",
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
        card: "12px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(15,23,42,0.06)",
      },
      spacing: {
        // enforce 8px base grid via named tokens where helpful
        "18": "4.5rem",   // 72px
        "22": "5.5rem",   // 88px
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
