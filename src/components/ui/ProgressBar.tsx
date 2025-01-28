interface ProgressBarProps {
  /** 현재 단계 (예: 1) */
  currentStep: number;
  /** 전체 단계 (예: 3) */
  totalSteps: number;
  /** 바 전체의 높이 Tailwind 클래스 (기본: h-2) */
  barHeight?: string;
  /** 진행 상태 바 색상 (기본: bg-blue-500) */
  barColor?: string;
  /** 배경 바 색상 (기본: bg-gray-300) */
  backgroundColor?: string;
  /** 라벨(`1/3`)을 표시할지 여부 (기본: true) */
  showLabel?: boolean;
  /** 라벨이 나타날 위치 (left|center|right, 기본: right) */
  labelPosition?: "left" | "center" | "right";
  /** 라벨 스타일 커스터마이징 (Tailwind 클래스, 기본: text-gray-600 text-sm) */
  labelStyle?: string;
  /** 라벨을 직접 정의하고 싶을 때 (없으면 `currentStep/totalSteps`) */
  customLabel?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  barHeight = "h-2",
  barColor = "bg-primary",
  backgroundColor = "bg-k-100",
  showLabel = true,
  labelPosition = "right",
  labelStyle = "font-serif text-k-700 text-sm font-medium leading-normal",
  customLabel,
}) => {
  // 진행 퍼센트 계산 (0~100)
  const percentage = Math.max(0, Math.min(100, (currentStep / totalSteps) * 100));

  // 라벨 정렬용 클래스
  let labelPositionClass = "justify-end";
  if (labelPosition === "left") labelPositionClass = "justify-start";
  else if (labelPosition === "center") labelPositionClass = "justify-center";

  return (
    <div className="flex items-center space-x-6">
      {/* 바 배경 */}
      <div className={`relative w-full rounded-full ${backgroundColor} ${barHeight}`}>
        {/* 진행중인 바 */}
        <div
          className={`${barColor} h-full rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* 라벨 */}
      {showLabel && (
        <div className={`flex ${labelPositionClass} min-w-5`}>
          <span className={labelStyle}>{customLabel ? customLabel : `${currentStep}/${totalSteps}`}</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
