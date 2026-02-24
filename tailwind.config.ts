import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#FFF4E6",
          100: "#FFEBD1",
          200: "#FFD9A3",
          300: "#FFC76B",
          400: "#FFB83D",
          500: "#FF7F00",
          600: "#FF9F1C",
          700: "#EA580C",
          800: "#D64806",
          900: "#B83800",
          950: "#7A2400",
          DEFAULT: "var(--primary)",
        },
        secondary: {
          50: "#F0F9FF",
          100: "#E0F2FE",
          200: "#BAE6FD",
          300: "#7DD3FC",
          400: "#38BDF8",
          500: "#0EA5E9",
          600: "#0284C7",
          700: "#0369A1",
          800: "#075985",
          900: "#0F172A",
          DEFAULT: "var(--secondary)",
        },
        sidebar: {
          background: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          border: "var(--sidebar-border)",
          iconBg: "var(--sidebar-icon-bg)",
          iconBgHover: "var(--sidebar-icon-bg-hover)",
          active: "var(--sidebar-active)",
          activeBg: "var(--sidebar-active-bg)",
        },
        surface: {
          DEFAULT: "var(--surface)",
          alt: "var(--surface-alt)",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
      },
      fontFamily: {
        sans: ["var(--font-fustat)", "Inter", "system-ui", "sans-serif"],
      },
      spacing: {
        sidebar: {
          collapsed: "5rem",
          expanded: "17.5rem",
        },
      },
      width: {
        "sidebar-collapsed": "5rem",
        "sidebar-expanded": "17.5rem",
      },
      transitionTimingFunction: {
        sidebar: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
