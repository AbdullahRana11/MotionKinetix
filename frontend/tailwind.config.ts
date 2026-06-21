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
      },
      letterSpacing: {
        hero: "0.2em",
      },
    },
  },
  plugins: [],
};

export default config;
