import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    fontFamily: {
      serif: [
        "var(--font-pretendard)",
        "Pretendard",
        "ui-serif",
        "Georgia",
        "Cambria",
        "Times New Roman",
        "Times",
        "serif",
      ],
    },
    extend: {
      colors: {
        "secondary-1": "#c4ddff",
        "secondary-2": "#f2f1df",
        "primary-1": "#5950f6",
        "primary-2": "#4672ee",
        primary: {
          "100": "#EFEEFF",
          "200": "#ABA7FA",
          "300": "#938DF9",
          "400": "#837CF8",
          "500": "#726AF7",
          "600": "#6259F7",
          DEFAULT: "#5950F6",
          "700": "#4E46D9",
          "800": "#403AB2",
          "900": "#262181",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          "100": "#E8EDFD",
          "200": "#C7D4FA",
          "300": "#A2B7F6",
          "400": "#8AA5F4",
          "500": "#5C82F0",
          DEFAULT: "#4672EE",
          "600": "#4068D9",
          "700": "#3455B2",
          "800": "#29428A",
          "900": "#1D2F63",
          foreground: "hsl(var(--secondary-foreground))",
        },
        k: {
          "0": "#FFFFFF",
          "50": "#F5F5F5",
          "100": "#DDDDDF",
          "200": "#C6C7C9",
          "300": "#AAACAF",
          "400": "#919397",
          "500": "#76797D",
          "600": "#5F6268",
          "700": "#484C52",
          "800": "#31353D",
          "900": "#1A1F27",
        },
        "gray-c": {
          "100": "#ececec",
        },
        "sub-a": {
          "100": "#9BC5F3",
          "500": "#60A3ED",
          DEFAULT: "#388CE8",
        },
        "sub-b": {
          "100": "#AADBF3",
          "500": "#6AC0EB",
          DEFAULT: "#2AA4E2",
        },
        background: {
          1: "#F8F8FA",
          2: "#F7F7F7",
          sdwA: "rgba(26, 31, 39, 0.4)",
          DEFAULT: "hsl(var(--background))",
        },
        line: {
          "1": "#f2f2f2",
          "2": "#e5e5e5",
        },
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      boxShadow: {
        sdwA: "0px 4px 40px 0px rgba(26, 31, 39, 0.40)",
      },
      spacing: {
        "13": "3.25rem", // 3.25rem = 13 = 52px
        "90": "22.5rem",
      },
      transitionProperty: {
        height: "height",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
