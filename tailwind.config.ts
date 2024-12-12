import type { Config } from "tailwindcss";

const config: Config = {
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
        // "primary-1": "#6f96d1",
        // "primary-2": "#091f5b",
        "secondary-1": "#c4ddff",
        "secondary-2": "#f2f1df",
        "primary-1": "#5950f6",
        "primary-2": "#4672ee",
        primary: {
          900: "#1D2F63",
          800: "#29428A",
          700: "#3455B2",
          600: "#4068D9",
          DEFAULT: "#4672EE",
          500: "#5C82F0",
          400: "#8AA5F4",
          300: "#A2B7F6",
          200: "#C7D4FA",
          100: "#C7D4FA",
        },

        secondary: {
          900: "#373299",
          800: "#403AB2",
          700: "#4E46D9",
          DEFAULT: "#5950F6",
          600: "#6259F7",
          500: "#726AF7",
          400: "#837CF8",
          300: "#938DF9",
          200: "#ABA7FA",
          100: "#CECBFD",
        },

        "gray-c": {
          100: "#ececec",
        },

        "sub-a": {
          DEFAULT: "#388CE8",
          500: "#60A3ED",
          100: "#9BC5F3",
        },

        "sub-b": {
          DEFAULT: "#2AA4E2",
          500: "#6AC0EB",
          100: "#AADBF3",
        },

        background: {
          1: "#f8f8fa",
          2: "#f7f7f7",
          sdwA50: "rgba(16, 47, 96, 0.05)",
          sdwA100: "rgba(16, 47, 96, 0.1)",
        },

        line: {
          1: "#f2f2f2",
          2: "#e5e5e5",
        },
      },
      boxShadow: {
        sdwA50: "0px 0px 20px 5px rgba(16, 47, 96, 0.05)",
        sdwA100: "0px 0px 20px 5px rgba(16, 47, 96, 0.05)",
      },
      spacing: {
        "90": "22.5rem",
      },
      transitionProperty: {
        height: "height",
      },
    },
  },
  plugins: [],
};
export default config;
