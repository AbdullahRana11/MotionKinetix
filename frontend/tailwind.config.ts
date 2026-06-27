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
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
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
      },
      backdropBlur: {
        "3xl": "64px",
      },
      letterSpacing: {
        hero: "0.2em",
      },
      textShadow: {
        crisp: "0 1px 3px rgba(0, 0, 0, 0.85)",
        hero: "0 2px 16px rgba(0, 0, 0, 0.9)",
      },
      backgroundImage: {
        "app-background": "url('/background.jpg')",
      },
    },
  },
  plugins: [],
};

export default config;
