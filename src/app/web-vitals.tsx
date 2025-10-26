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

    // Web Vitals를 커스텀 트랜잭션으로 Sentry에 전송
    const transaction = Sentry.startInactiveSpan({
      name: `Web Vital: ${name}`,
      op: "web-vital",
      attributes: {
        "web-vital.name": name,
        "web-vital.value": value,
        "web-vital.rating": rating,
        "web-vital.navigation-type": navigationType,
        "web-vital.id": id,
      },
    });

    if (transaction) {
      // CLS는 unitless 메트릭이므로 unit을 생략, 나머지는 millisecond
      if (name === "CLS") {
        transaction.setMeasurement(name, value);
      } else {
        transaction.setMeasurement(name, value, "millisecond");
      }

      // 트랜잭션 완료
      transaction.end();
    }

    // Sentry에 메트릭 직접 전송 (가장 확실한 방법)
    Sentry.metrics.distribution(name, value, {
      tags: {
        rating,
        navigationType,
      },
      unit: name === "CLS" ? "none" : "millisecond",
    });

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
