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
          100: "#E8EDFD",
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

        k: {
          900: "#1A1F27",
          800: "#31353D",
          700: "#484C52",
          600: "#5F6268",
          500: "#76797D",
          400: "#919397",
          300: "#AAACAF",
          200: "#C6C7C9",
          100: "#DDDDDF",
          50: "#EFEFF0",
          0: "#FFFFFF",
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
          1: "#F8F8FA",
          2: "#F7F7F7",
          sdwA: "rgba(26, 31, 39, 0.4)",
        },

        line: {
          1: "#f2f2f2",
          2: "#e5e5e5",
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
    },
  },
  plugins: [],
};
export default config;
