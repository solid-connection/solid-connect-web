import React from "react";

interface ProgressBarProps {
  /** 현재 단계 (예: 1) */
  currentStep: number;
  /** 전체 단계 (예: 3) */
  totalSteps: number;
  /** 바 전체의 높이 Tailwind 클래스 (기본: h-3) */
  barHeight?: string;
  /** 진행 상태 바 색상 (기본: 그라데이션) */
  barColor?: string;
  /** 배경 바 색상 (기본: bg-gray-200) */
  backgroundColor?: string;
  /** Indicator 색상 (기본: bg-white) */
  indicatorColor?: string;
  /** Indicator 크기 (기본: w-5 h-5) */
  indicatorSize?: string;
  /** 라벨(`1/3`)을 표시할지 여부 (기본: false) */
  showLabel?: boolean;
  /** 라벨 스타일 커스터마이징 (기본: text-gray-600 text-sm) */
  labelStyle?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  barHeight = "h-1.5",
  barColor = "bg-gradient-to-r from-sub-a to-primary",
  backgroundColor = "bg-gray-200",
  indicatorColor = "bg-primary",
  indicatorSize = "w-2.5 h-2.5",
  showLabel = false,
  labelStyle = "text-gray-600 typo-medium-2",
}) => {
  // 진행 퍼센트 계산 (0~100)
  const percentage = Math.max(0, Math.min(100, (currentStep / totalSteps) * 100));

  return (
    <div className="w-full">
      {/* 바 컨테이너 */}
      <div className={`relative w-full rounded-full ${backgroundColor} ${barHeight}`}>
        {/* 진행중인 바 (그라데이션) */}
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
          style={{ width: `${percentage}%` }}
        />

        {/* Indicator (진행 상태 원) */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 rounded-full shadow-md transition-all duration-500 ease-out ${indicatorColor} ${indicatorSize}`}
          style={{
            left: `${percentage}%`,
            // 원이 바의 끝에 정확히 걸치도록 위치 조정
            transform: `translateX(-${percentage}%) translateY(-50%)`,
          }}
        />
      </div>

      {/* 라벨 (선택 사항) */}
      {showLabel && (
        <div className="mt-2 flex justify-end">
          <span className={labelStyle}>
            {currentStep}/{totalSteps}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
