import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import plugin from "tailwindcss/plugin";

// 타이포그래피 유틸리티 플러그인 (typo- 접두사 사용)
const typographyPlugin = plugin(({ addUtilities, theme }) => {
  const fontSizeConfig = theme("fontSize");
  const typographyUtilities: Record<string, Record<string, string>> = {};

  // fontSize 설정에서 타이포그래피 유틸리티 생성
  if (fontSizeConfig && typeof fontSizeConfig === "object") {
    Object.keys(fontSizeConfig).forEach((key) => {
      const fontSizeValue = fontSizeConfig[key];
      if (typeof fontSizeValue === "object" && fontSizeValue !== null && Array.isArray(fontSizeValue)) {
        const [fontSize, options] = fontSizeValue as [string, { lineHeight?: string; fontWeight?: string }];
        const lineHeight = options?.lineHeight || "inherit";
        const fontWeight = options?.fontWeight || "inherit";

        typographyUtilities[`.typo-${key}`] = {
          "font-size": fontSize,
          "line-height": lineHeight === "auto" ? "normal" : lineHeight,
          "font-weight": fontWeight,
        };
      }
    });
  }

  addUtilities(typographyUtilities);
});

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  safelist: [
    "ml-0",
    "ml-12",
    "bg-secondary",
    "text-white",
    "border-b-secondary",
    "bg-primary",
    "text-k-0",
    "border-b-primary",
    {
      pattern: /pb-(28|32|36|40)/,
    },
  ],
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
      sans: ["Pretendard", "sans-serif"],
    },
    extend: {
      fontSize: {
        /* ==========================
           1. Bold (Weight 700)
           ========================== */
        "bold-1": ["24px", { lineHeight: "140%", fontWeight: "700" }],
        "bold-2": ["20px", { lineHeight: "150%", fontWeight: "700" }],
        "bold-3": ["18px", { lineHeight: "150%", fontWeight: "700" }],
        "bold-4": ["16px", { lineHeight: "150%", fontWeight: "700" }],
        "bold-5": ["14px", { lineHeight: "auto", fontWeight: "700" }],
        "bold-6": ["12px", { lineHeight: "150%", fontWeight: "700" }],
        "bold-7": ["10px", { lineHeight: "150%", fontWeight: "700" }],
        /* ==========================
           2. SemiBold (Weight 600)
           ========================== */
        "sb-1": ["32px", { lineHeight: "auto", fontWeight: "600" }],
        "sb-2": ["24px", { lineHeight: "auto", fontWeight: "600" }],
        "sb-3": ["22px", { lineHeight: "150%", fontWeight: "600" }],
        "sb-4": ["20px", { lineHeight: "150%", fontWeight: "600" }],
        "sb-5": ["18px", { lineHeight: "150%", fontWeight: "600" }],
        "sb-6": ["17px", { lineHeight: "auto", fontWeight: "600" }],
        "sb-7": ["16px", { lineHeight: "auto", fontWeight: "600" }],
        "sb-8": ["15px", { lineHeight: "150%", fontWeight: "600" }],
        "sb-9": ["14px", { lineHeight: "150%", fontWeight: "600" }],
        "sb-10": ["13px", { lineHeight: "150%", fontWeight: "600" }],
        "sb-11": ["12px", { lineHeight: "150%", fontWeight: "600" }],
        "sb-12": ["11px", { lineHeight: "150%", fontWeight: "600" }],
        /* ==========================
           3. Medium (Weight 500)
           ========================== */
        "medium-1": ["16px", { lineHeight: "auto", fontWeight: "500" }],
        "medium-2": ["14px", { lineHeight: "150%", fontWeight: "500" }],
        "medium-3": ["13px", { lineHeight: "150%", fontWeight: "500" }],
        "medium-4": ["12px", { lineHeight: "150%", fontWeight: "500" }],
        "medium-5": ["11px", { lineHeight: "14px", fontWeight: "500" }],
        /* ==========================
           4. Regular (Weight 400)
           ========================== */
        "regular-1": ["16px", { lineHeight: "150%", fontWeight: "400" }],
        "regular-2": ["14px", { lineHeight: "150%", fontWeight: "400" }],
        "regular-3": ["13px", { lineHeight: "150%", fontWeight: "400" }],
        "regular-4": ["12px", { lineHeight: "150%", fontWeight: "400" }],
        "regular-5": ["11px", { lineHeight: "150%", fontWeight: "400" }],
        "regular-6": ["10px", { lineHeight: "150%", fontWeight: "400" }],
      },
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
        // 하드코딩된 회색 계열 색상
        gray: {
          "950": "#000000",
          "900": "#121212",
          "850": "#1a1a1a",
          "800": "#1E1E1E",
          "700": "#3c3c3c",
          "600": "#4d4d4d",
          "500": "#595959",
          "400": "#606060",
          "350": "#707070",
          "300": "#7a7a7a",
          "250": "#7c7c7c",
          "200": "#7D7D7D",
          "150": "#808080",
          "100": "#8d8d8d",
          "50": "#acacac",
        },
        // 하드코딩된 배경색 계열
        bg: {
          "50": "#fafafa",
          "100": "#f9f9f9",
          "200": "#f5f5f5",
          "300": "#f0f0f0",
          "400": "#ececec",
          "500": "#e2e2e2",
          "600": "#d9d9d9",
          "700": "#d7d7d7",
          "800": "#c4c4c4",
          "900": "#c2c2c2",
        },
        // 하드코딩된 텍스트 색상
        text: {
          black: "#000000",
          dark: "#040000",
          "gray-900": "#121212",
          "gray-800": "#1E1E1E",
          "gray-700": "#3c3c3c",
          "gray-600": "#4d4d4d",
          "gray-500": "#595959",
          "gray-400": "#606060",
          "gray-350": "#707070",
          "gray-300": "#7a7a7a",
          "gray-250": "#7c7c7c",
          "gray-200": "#7D7D7D",
          "gray-150": "#808080",
          "gray-100": "#8d8d8d",
          "gray-50": "#acacac",
          brown: "#44413d",
        },
        // 하드코딩된 강조 색상 (기존 accent와 병합)
        "accent-custom": {
          green: "#15A861",
          orange: "#FF7300",
          yellow: "#FEE500",
          red: "#E22A2D",
          "red-light": "#FFD9D9",
          "orange-light": "#FEA65E",
          indigo: "#6366f1",
          "green-dark": "#78A32C",
        },
        // 하드코딩된 배경 강조 색상
        "bg-accent": {
          blue: "#F0F5FF",
          sky: "#EBF8FF",
          orange: "#FFF3E5",
          green: "#E9F7EC",
        },
        // 하드코딩된 파란색 그라데이션
        "blue-gradient": {
          from: "#2E5CFF",
          via: "#4A7AFF",
          to: "#6BA3FF",
          accent: "#4A90FF",
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
        "sub-c": {
          "100": "#FFF2DD",
          "500": "#FF934B",
        },
        "sub-d": {
          "100": "#FCEFFF",
          "500": "#B33BD4",
        },
        "sub-e": {
          "100": "#E4F7C0",
          "500": "#7AB550",
        },
        "sub-f": {
          "100": "#FFDEDF",
          "500": "#FF6B6B",
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
        sdwB: "0px 0px 4px 0px var(--K100, #DDDDDF)",
        sdwC: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
        top: "0px -4px 10px 0px #F5F5F5",
      },
      spacing: {
        "13": "3.25rem", // 3.25rem = 13 = 52px
        "90": "22.5rem",
        "6.5": "1.625rem", // 26px
        "17.5": "4.375rem", // 70px
        "30": "7.5rem", // 120px
        "37.5": "9.375rem", // 150px
      },
      maxWidth: {
        app: "600px",
      },
      minWidth: {
        app: "360px",
      },
      transitionProperty: {
        height: "height",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-in",
        fadeIn: "fadeIn 0.3s ease-out",
        fadeOut: "fadeOut 0.3s ease-out",
        slideInRight: "slideInRight 0.3s ease-out",
        slideOutRight: "slideOutRight 0.3s ease-in",
      },
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(100%)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideOutRight: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate, typographyPlugin],
};
export default config;
