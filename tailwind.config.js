/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#5B4B8A", // Royal Iris
          hover: "#4A3C72",
          active: "#3E325E",
          tint: "#F4F1F8",
          light: "#EBE5F5",
        },
        iris: {
          DEFAULT: "#5B4B8A",
          hover: "#4A3C72",
          active: "#3E325E",
          tint: "#F4F1F8",
        },
        butter: {
          DEFAULT: "#F5E6C8", // Butter Yellow
          light: "#FDF9F0",
          border: "#EDE0C4",
        },
        nearblack: "#1A1A1A",
        surface: "#FFFFFF",
        border: "#EDE0C4",
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
        slot: "0 1px 3px rgba(91, 75, 138, 0.08)",
      },
      spacing: {
        "4.5": "1.125rem",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
