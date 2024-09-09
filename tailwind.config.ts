import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    fontFamily: {
      serif: ["Pretendard", "ui-serif", "Georgia", "Cambria", "Times New Roman", "Times", "serif"],
    },
    extend: {},
  },
  plugins: [],
};
export default config;
