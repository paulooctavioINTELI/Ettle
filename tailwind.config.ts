import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    colors: {
      background: "#181819",
      primary: "#FF6831",
      light: "#FFFFFF",
      surface: "#202024",
      muted: "#9CA3AF",
    },
    boxShadow: {
      glow: "0 0 0 8px rgba(255,104,49,0.12)",
      DEFAULT: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
      md: "0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)",
    },
    borderRadius: {
      none: "0",
      sm: "0.125rem",
      DEFAULT: "0.25rem",
      md: "0.375rem",
      lg: "0.5rem",
      xl: "0.75rem",
      "2xl": "1rem",
      soft: "1.25rem",
      full: "9999px",
    },
    extend: {
      // put things like spacing, typography, animations here if you need them
    },
  },
};

export default config;
