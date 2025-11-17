# Solid Connection

교환학생 준비를 위한 종합 정보 플랫폼

## 프로젝트 개요

Solid Connection은 교환학생을 준비하는 학생들을 위한 올인원 플랫폼입니다. 대학 정보 검색부터 멘토링, 커뮤니티까지 교환학생 준비의 모든 과정을 하나의 서비스에서 제공합니다.

### 주요 기능

- **대학 정보 검색**: 전 세계 파트너 대학 정보 및 지도 기반 위치 확인
- **성적 관리**: GPA 및 어학 성적 제출/조회 시스템
- **멘토링 시스템**: 실시간 채팅 기반 1:1 멘토링
- **커뮤니티**: 교환학생 경험 공유 및 Q&A
- **소셜 로그인**: 카카오, Apple 로그인 지원

## 기술 스택

### Core
- **Next.js 14** (App Router)
- **React 18**
- **TypeScript 5**
- **Tailwind CSS**

### State Management & Data Fetching
- **TanStack React Query** - 서버 상태 관리
- **Zustand** - 클라이언트 상태 관리
- **React Hook Form + Zod** - 폼 검증

### Infrastructure
- **Vercel** - 배포 및 ISR
- **Firebase** - 실시간 데이터베이스
- **Sentry** - 에러 모니터링
- **Google Maps API** - 지도 서비스
- **AWS S3** - 파일 스토리지

## 성능 최적화

### 홈페이지 성능 개선

Google Analytics 데이터 분석 결과, 메인 페이지의 이탈률 21%와 LCP 15초라는 심각한 성능 문제를 발견했습니다. 이를 체계적으로 개선하여 사용자 경험을 크게 향상시켰습니다.

**개선 전략**:
- 이미지 최적화: PNG → AVIF/WebP 자동 변환, 최대 60% 용량 절감
- ISR 전환: CSR → ISR(Incremental Static Regeneration)로 정적 페이지 생성
- Code Splitting: LCP 요소 최적화, IntersectionObserver 기반 지연 로딩
- 번들 최적화: 레거시 CSS 제거, Critical CSS 인라인화

**성과**:

| 지표 | 개선 전 | 개선 후 | 개선율 |
|------|---------|---------|--------|
| LCP | 9.961s | 0.874s | 91.2% ↓ |
| FCP | 4.561s | 0.874s | 80.8% ↓ |
| Speed Index | 5.819s | 1.960s | 66.3% ↓ |
| CLS | 0.014 | 0 | 100% ↓ |
| Page Weight | 17,105KB | 4,679KB | 72.6% ↓ |

### 커뮤니티 공개 전환 및 최적화

GA 데이터 분석을 통해 커뮤니티 접근성 문제를 발견하고, 비로그인 사용자에게도 콘텐츠를 공개하는 전략적 결정을 내렸습니다.

**개선 전략**:
- 콘텐츠 공개: 로그인 장벽 제거로 SEO 및 바이럴 효과 확보
- RSC 도입: React Server Components로 서버 사이드 렌더링 최적화
- HydrationBoundary: 서버 데이터와 React Query의 효율적 연결
- 가상화 무한 스크롤: TanStack Virtual로 DOM 노드 최적화

**성과**:

| 지표 | 개선 전 | 개선 후 | 개선율 |
|------|---------|---------|--------|
| TTFB | 1.413s | 0.894s | 37% ↓ |
| LCP | 2.967s | 1.994s | 33% ↓ |

### 비용 절감 효과

| 항목 | 개선 전 | 개선 후 | 절감 효과 |
|------|---------|---------|-----------|
| Page Weight | 17MB | 4.7MB | 72% ↓ |
| 월간 전송량 (홈 618뷰) | 10.5GB | 2.9GB | 7.6GB CDN egress ↓ |
| 서버 API 요청 | 3회/뷰 | 캐시 Hit | 66% API 부하 ↓ |
| 이탈률 (예상) | 21% | 16% | 5%p ↓ |

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── (home)/            # 홈페이지 (ISR)
│   ├── university/        # 대학 정보
│   ├── mentor/            # 멘토링 시스템
│   ├── community/         # 커뮤니티 (RSC + HydrationBoundary)
│   ├── score/             # 성적 관리
│   └── my/                # 마이페이지
├── components/            # 재사용 컴포넌트
│   ├── ui/               # Radix UI 기반 컴포넌트
│   └── ...
├── api/                   # API 호출 함수
│   ├── */client/         # useQuery/useMutation 훅
│   └── */server/         # 서버사이드 데이터 페칭
├── lib/                   # 라이브러리 설정
│   ├── zustand/          # 상태 관리
│   └── react-query/      # 서버 상태 관리
├── utils/                 # 유틸리티 함수
└── types/                 # TypeScript 타입 정의
```

## 시작하기

### 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린트 검사
npm run lint
```

## 학습 포인트

### 성능 최적화 경험

Google Analytics로 실제 사용자 데이터를 분석하고, 이를 바탕으로 성능 문제를 발견했습니다. LCP 15초라는 심각한 지표를 보고 충격을 받았지만, 이를 체계적으로 개선하는 과정에서 많은 것을 배웠습니다.

이미지 최적화부터 시작해 ISR 전환, Code Splitting까지 하나씩 적용하면서 지표가 개선되는 것을 확인할 수 있었습니다. 특히 CSR에서 ISR로 전환했을 때 LCP가 극적으로 개선된 것이 인상적이었습니다.

### RSC와 HydrationBoundary

커뮤니티 페이지를 공개로 전환하면서 React Server Components를 도입했습니다. 서버에서 데이터를 페칭하고, HydrationBoundary로 React Query와 연결하는 패턴이 처음에는 낯설었지만, 이해하고 나니 서버와 클라이언트의 역할 분담이 명확해졌습니다.

### 데이터 기반 의사결정

GA 데이터를 통해 "왜 사용자들이 커뮤니티에 접근하지 못하는가?"를 발견했습니다. 로그인 장벽이 있었기 때문이었습니다. 콘텐츠를 공개로 전환한 후, 실제로 트래픽과 참여도가 증가하는 것을 확인하면서 데이터 기반 의사결정의 중요성을 체감했습니다.

## 향후 계획

- Real User Monitoring (RUM) 도입으로 실사용자 기반 성능 모니터링
- 지속적인 Core Web Vitals 최적화
- 사용자 경험 데이터 기반 기능 개선

## 참고 자료

- [카카오웹툰 - 사용자 경험과 성능 개선 방법](https://fe-developers.kakaoent.com/2023/230202-kakaowebtoon-web-performance-improvement/)
- [Fix Your LCP Score By Improving Render Delay](https://www.debugbear.com/blog/fix-lcp-by-improving-render-delay)
- [WebPageTest](https://www.webpagetest.org/)

---

더 빠르게, 더 가볍게, 더 나은 사용자 경험을 만들어갑니다.
