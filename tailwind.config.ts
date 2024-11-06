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

        "gray-c": {
          100: "#ececec",
        },
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
