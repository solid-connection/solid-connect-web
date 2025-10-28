"use client";

import { useReportWebVitals } from "next/web-vitals";

/**
 * Next.js Web Vitals를 개발 환경에서 콘솔로 확인하는 컴포넌트
 *
 * 📊 Sentry로 자동 수집되는 메트릭:
 * - CLS (Cumulative Layout Shift): 레이아웃 안정성
 * - FCP (First Contentful Paint): 첫 콘텐츠 표시 시간
 * - FID (First Input Delay): 첫 입력 지연 (INP로 대체 예정)
 * - INP (Interaction to Next Paint): 상호작용 응답성
 * - LCP (Largest Contentful Paint): 최대 콘텐츠 표시 시간
 * - TTFB (Time to First Byte): 첫 바이트까지의 시간
 *
 * ℹ️ Sentry의 browserTracingIntegration (enableInp: true)이 활성화되어 있어
 *    Web Vitals가 자동으로 수집됩니다. 수동으로 span을 생성할 필요가 없습니다.
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    const { name, value, rating, navigationType } = metric;

    // 개발 환경에서는 콘솔에도 출력
    if (process.env.NODE_ENV === "development") {
      console.log(`[Web Vitals] ${name}:`, {
        value: name === "CLS" ? value.toFixed(3) : `${Math.round(value)}ms`,
        rating,
        navigationType,
      });
    }
  });

  return null;
}
