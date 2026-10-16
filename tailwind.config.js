import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input-bg)",
        background: "var(--page-bg)",
        foreground: "var(--text-primary)",
        primary: {
          DEFAULT: "var(--purple)",
          foreground: "var(--gray-100)",
        },
        secondary: {
          DEFAULT: "var(--surface-muted)",
          foreground: "var(--text-primary)",
        },
        muted: {
          DEFAULT: "var(--surface-muted)",
          foreground: "var(--text-secondary)",
        },
        accent: {
          DEFAULT: "var(--surface-hover)",
          foreground: "var(--text-primary)",
        },
        destructive: {
          DEFAULT: "#dc2626",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "var(--surface)",
          foreground: "var(--text-primary)",
        },
        popover: {
          DEFAULT: "var(--surface)",
          foreground: "var(--text-primary)",
        },
        ring: "var(--purple-light)",
        chart: {
          1: "var(--purple-light)",
          2: "var(--success)",
          3: "var(--orange)",
          4: "var(--yellow)",
          5: "var(--blue)",
        },
        sidebar: {
          DEFAULT: "var(--surface)",
          foreground: "var(--text-primary)",
          primary: "var(--purple)",
          "primary-foreground": "var(--gray-100)",
          accent: "var(--surface-hover)",
          "accent-foreground": "var(--text-primary)",
          border: "var(--border)",
          ring: "var(--purple-light)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
