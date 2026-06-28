import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e0fdff",
          400: "#33f2fd",
          500: "#00eefc",
          600: "#00c0cb",
          900: "#004850",
        },
        ice: {
          DEFAULT: "#A8C8DC",
          bright: "#C5E4F7",
          muted: "#6B8FA3",
        },
        copper: {
          DEFAULT: "#C9A87C",
          muted: "#8A7355",
        },
        neutral: {
          50: "#f0f1f5",
          400: "#9ba1b0",
          700: "#2a2d3b",
          800: "#1a1c26",
          900: "#0A0B10",
        },
        success: "#00FF80",
        warning: "#FFB800",
        error: "#FF3366",
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 30px -5px rgba(0, 238, 252, 0.3)",
        "glow-success": "0 0 30px -5px rgba(0, 255, 128, 0.3)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        liquid: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        spatial: "0 20px 50px rgba(0, 0, 0, 0.5)",
        "input-inner": "inset 0 2px 8px rgba(0, 0, 0, 0.45)",
        "input-focus-glow":
          "inset 0 2px 8px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(0, 238, 252, 0.35), 0 0 24px rgba(0, 238, 252, 0.2)",
        elite: "0 24px 80px -20px rgba(0, 0, 0, 0.65)",
        "elite-hover": "0 32px 64px -24px rgba(0, 0, 0, 0.55)",
      },
      backdropBlur: {
        "3xl": "64px",
      },
      letterSpacing: {
        hero: "0.2em",
        label: "0.12em",
        display: "0.04em",
      },
      transitionDuration: {
        elite: "500ms",
      },
      transitionTimingFunction: {
        elite: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      textShadow: {
        crisp: "0 1px 3px rgba(0, 0, 0, 0.85)",
        hero: "0 2px 16px rgba(0, 0, 0, 0.9)",
      },
      backgroundImage: {
        "app-background": "url('/background.jpg')",
        "hero-text": "linear-gradient(180deg, #f4f4f5 0%, #d4d4d8 50%, #a1a1aa 100%)",
        "nav-border": "linear-gradient(90deg, transparent, rgba(168, 200, 220, 0.35), transparent)",
      },
    },
  },
  plugins: [],
};

export default config;
