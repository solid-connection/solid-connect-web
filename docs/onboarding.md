# solid-connect-web 온보딩

솔리드커넥션 웹 프로젝트에 새롭게 참가하는 개발자를 위한 온보딩 문서입니다.

solid-connect-web은 Next.js(App Router) 기반의 프로젝트입니다.

## 개발 시작하기

```bash
npm install
npm run dev
```

## 린팅, 포매팅

- ESLint
- Prettier
  해당 프로젝트에서는 ESLint와 Prettier를 사용하여 코드의 품질을 관리합니다.

ESLint는 eslint-config-airbnb를 기반으로 next의 기본적인 next관련 규칙을 추가해주는 @next/next/recommended를 추가해 사용하고 있습니다.

그리고 Prettier과의 충돌을 막기 위해 eslint-config-prettier를 통해 Prettier와 충돌하는 ESLint 규칙을 비활성화하고 있습니다.

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Next.js ESLint Guide](https://nextjs.org/docs/pages/building-your-application/configuring/eslint)

### import 순서 정렬

import 순서를 정렬하기 위해 Prettier 플러그인인 @trivago/prettier-plugin-sort-imports를 사용하고 있습니다.

TODO: eslint-plugin-import의 import/order로 변경, 규칙 목록 작성

## 프로젝트 구조

- public: 정적 파일
- docs: 문서 파일
- src
  - /api: API call 인터페이스
  - /apps: Next.js 지정 app 파일
  - /components: 공용 컴포넌트 파일
  - /constants: 상수 파일
  - /containers: 비공용 컴포넌트 파일
  - /context: React 컨텍스트 파일
  - /libs: 외부 라이브러리 사용 파일
  - /styles: 정적 css 파일
  - /types: TypeScript 타입 정의 파일
  - /utils: 유틸성 함수
- .env: 공개 환경 변수
- .env.local: 미공개 환경 변수
- .eslintrc.json: ESLint 설정
- .prettierrc.json: Prettier 설정
- headver.json: 버저닝중 head 버전 관리용 파일
- tailwind.config.js: Tailwind CSS 설정
- tsconfig.json: TypeScript 설정

## 인증 처리

인증 처리를 공통으로 처리하기 위하여, 인증과 관련된 절차를 자동으로 처리해주는 axios client가 utils에 준비되어 있습니다.

모든 인증이 필요한 API 요청은 기본적으로 server side rendering이 아닌, client side rendering 단계에서 진행하고 있습니다. 인증이 필요하지 않은 페이지는, 기본적으로 server side rendering과 static rendering을 사용하는 것을 권장합니다.
