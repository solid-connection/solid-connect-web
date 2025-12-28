/**
 * ESLint 설정 파일
 * Next.js + TypeScript 프로젝트용
 *
 * 주요 설정:
 * - TypeScript 파서 사용
 * - Next.js 및 TypeScript 권장 규칙 적용
 * - Prettier와의 충돌 방지
 */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  plugins: ["@typescript-eslint"],
  extends: [
    // Next.js 기본 설정
    "next",
    // Next.js TypeScript 설정 (plugin:@typescript-eslint/recommended 기반)
    "next/typescript",
    // TypeScript ESLint 권장 규칙
    "plugin:@typescript-eslint/recommended",
    // Prettier와 충돌하는 규칙 비활성화 (항상 마지막에 위치해야 함)
    "prettier",
  ],
  overrides: [
    {
      // 설정 파일들은 TypeScript 프로젝트에 포함되지 않으므로 project 옵션 비활성화
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}", "*.config.{js,mjs,ts}"],
      parserOptions: {
        sourceType: "script",
        project: null,
      },
    },
  ],
  rules: {
    // ==========================================
    // React 관련 규칙
    // ==========================================

    // JSX 사용 시 React import 불필요 (React 17+)
    "react/react-in-jsx-scope": "off",

    // JSX 허용 파일 확장자
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx", ".tsx"] }],

    // defaultProps 필수 여부 비활성화
    "react/require-default-props": "off",

    // 함수 컴포넌트는 화살표 함수로 정의
    "react/function-component-definition": [1, { namedComponents: "arrow-function" }],

    // ==========================================
    // Import 관련 규칙
    // ==========================================

    // import 순서는 Prettier 플러그인에서 처리
    "import/order": "off",

    // import 시 파일 확장자 생략
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],

    // 단일 export 시 default export 권장 (warning)
    "import/prefer-default-export": 1,

    // ==========================================
    // 일반 JavaScript 규칙
    // ==========================================

    // console.log 허용 (개발 편의)
    "no-console": "off",

    // alert 허용
    "no-alert": "off",

    // 정의 전 사용 허용 (TypeScript에서 처리)
    "no-use-before-define": "off",

    // 미사용 변수 경고
    "no-unused-vars": "warn",

    // ==========================================
    // TypeScript 관련 규칙
    // ==========================================

    // 미사용 변수 경고 (TypeScript용)
    "@typescript-eslint/no-unused-vars": "warn",

    // any 타입 관련 규칙 (경고로 설정)
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/no-unsafe-member-access": "warn",
    "@typescript-eslint/no-unsafe-return": "warn",
    "@typescript-eslint/no-unsafe-call": "warn",
    "@typescript-eslint/no-unsafe-argument": "warn",

    // ==========================================
    // 접근성 (a11y) 관련 규칙
    // ==========================================

    // label과 control 연결 규칙 비활성화
    "jsx-a11y/label-has-associated-control": "off",

    // 클릭 이벤트에 키보드 이벤트 필요 (경고)
    "jsx-a11y/click-events-have-key-events": "warn",

    // 정적 요소에 이벤트 핸들러 (경고)
    "jsx-a11y/no-static-element-interactions": "warn",
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: "./tsconfig.json",
      },
    },
  },
};
