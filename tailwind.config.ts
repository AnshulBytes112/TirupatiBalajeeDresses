import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.25rem",
        md: "1.5rem",
        lg: "2rem",
        xl: "2.5rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        brand: {
          cream: {
            50: "#FCFAF6",
            100: "#FAF7F2",
            200: "#F4EFE6",
            300: "#EAE2D3",
            DEFAULT: "#FAF7F2",
          },
          yellow: {
            50: "#FEFCE8",
            100: "#FEF9C3",
            200: "#FEF08A",
            300: "#FDE047",
            400: "#FACC15",
            500: "#EAB308",
            600: "#CA8A04",
            DEFAULT: "#FACC15",
            accent: "#FDE047",
          },
          navy: {
            50: "#F0F4F8",
            100: "#D9E2EC",
            200: "#BCCCDC",
            700: "#1E293B",
            800: "#0F172A",
            900: "#0B132B",
            950: "#070C1B",
            DEFAULT: "#0F172A",
          },
          black: "#090D16",
          pastel: {
            blue: {
              DEFAULT: "#E0F2FE",
              light: "#F0F9FF",
              border: "#BAE6FD",
              text: "#0369A1",
            },
            pink: {
              DEFAULT: "#FCE7F3",
              light: "#FDF2F8",
              border: "#FBCFE8",
              text: "#BE185D",
            },
            green: {
              DEFAULT: "#DCFCE7",
              light: "#F0FDF4",
              border: "#BBF7D0",
              text: "#15803D",
            },
            yellow: {
              DEFAULT: "#FEF9C3",
              light: "#FEFCE8",
              border: "#FEF08A",
              text: "#A16207",
            },
          },
        },
        primary: {
          DEFAULT: "#0F172A",
          foreground: "#FFFFFF",
          hover: "#1E293B",
        },
        secondary: {
          DEFAULT: "#FACC15",
          foreground: "#0F172A",
          hover: "#EAB308",
        },
        muted: {
          DEFAULT: "#F1F5F9",
          foreground: "#64748B",
        },
        accent: {
          DEFAULT: "#FDE047",
          foreground: "#0F172A",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#0F172A",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
        pill: "9999px",
      },
      fontFamily: {
        sans: [
          "var(--font-outfit)",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "var(--font-outfit)",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)",
        card: "0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.02)",
        "card-hover": "0 12px 28px -4px rgba(15, 23, 42, 0.1), 0 4px 12px -2px rgba(15, 23, 42, 0.04)",
        button: "0 4px 12px rgba(250, 204, 21, 0.35)",
        nav: "0 2px 10px rgba(0, 0, 0, 0.03)",
        modal: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
      },
      screens: {
        xs: "375px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
    },
  },
  plugins: [],
};

export default config;
