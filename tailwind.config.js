/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4B3A9E", // Royal Iris
          hover: "#3E3086",
          active: "#32276F",
          tint: "#E9E5F7",
          light: "#D8D2F0",
        },
        butter: {
          DEFAULT: "#FFF4B8", // Butter Yellow
          light: "#FFFBEA",
          border: "#F5E8B0",
        },
        nearblack: "#1A1A1A",
        surface: "#FFFFFF",
        border: "#F5E8B0",
        muted: "#9CA3AF",
        disabled: "#E5E7EB",
        success: "#16A34A",
        error: "#DC2626",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
      },
      boxShadow: {
        card: "0 2px 12px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)",
        subtle: "0 1px 2px rgba(0, 0, 0, 0.04)",
        slot: "0 1px 3px rgba(75, 58, 158, 0.08)",
      },
      spacing: {
        "4.5": "1.125rem",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
