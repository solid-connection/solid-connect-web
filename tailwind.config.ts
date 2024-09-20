import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    colors: {
      "primary-1": "#6f96d1",
      "primary-2": "#091f5b",
      "secondary-1": "#c4ddff",
      "secondary-2": "#f2f1df",
      white: "#ffffff",
      black: "#000000",
    },
    fontFamily: {
      serif: ["Pretendard", "ui-serif", "Georgia", "Cambria", "Times New Roman", "Times", "serif"],
    },
    extend: {},
  },
  plugins: [],
};
export default config;
