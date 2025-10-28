"use client";

import { useReportWebVitals } from "next/web-vitals";

import * as Sentry from "@sentry/nextjs";

/**
 * Next.js Web Vitals를 Sentry로 전송하는 컴포넌트
 *
 * 측정되는 메트릭:
 * - CLS (Cumulative Layout Shift): 레이아웃 안정성
 * - FCP (First Contentful Paint): 첫 콘텐츠 표시 시간
 * - FID (First Input Delay): 첫 입력 지연 (INP로 대체 예정)
 * - INP (Interaction to Next Paint): 상호작용 응답성
 * - LCP (Largest Contentful Paint): 최대 콘텐츠 표시 시간
 * - TTFB (Time to First Byte): 첫 바이트까지의 시간
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    const { name, value, rating, navigationType, id } = metric;

    // Sentry v10+: startSpan으로 Web Vitals 측정값을 트랜잭션으로 전송
    Sentry.startSpan(
      {
        name: `Web Vital: ${name}`,
        op: "web-vital",
        attributes: {
          "web-vital.name": name,
          "web-vital.value": value,
          "web-vital.rating": rating,
          "web-vital.navigation-type": navigationType,
          "web-vital.id": id,
        },
      },
      (span) => {
        // CLS는 unitless 메트릭이므로 unit을 생략, 나머지는 millisecond
        if (name === "CLS") {
          span?.setMeasurement(name, value);
        } else {
          span?.setMeasurement(name, value, "millisecond");
        }
      },
    );

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
