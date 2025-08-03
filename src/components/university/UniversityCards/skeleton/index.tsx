import clsx from "clsx";

type UniversityCardsSkeletonProps = {
  /** 렌더링할 카드 개수 (기본 3개) */
  count?: number;
  style?: React.CSSProperties;
  className?: string;
};

/** UniversityCards 로딩 상태 Skeleton */
const UniversityCardsSkeleton = ({ count = 3, style, className }: UniversityCardsSkeletonProps) => (
  <div className={clsx("flex flex-col gap-2.5", className)} style={style}>
    {[...Array(count)].map((_, idx) => (
      <div
        key={idx}
        className="relative h-[91px] animate-pulse overflow-hidden rounded-lg border border-solid border-k-100 bg-k-50"
      >
        <div className="flex h-full justify-between px-5 py-3.5">
          {/* 썸네일 원형 */}
          <div className="flex gap-[23.5px]">
            <div className="flex flex-shrink-0 items-center">
              <div className="h-14 w-14 rounded-full bg-k-100" />
            </div>

            {/* 텍스트 라인 3줄 */}
            <div className="flex flex-col justify-center gap-2">
              <div className="h-4 w-32 rounded bg-k-100" />
              <div className="h-3 w-48 rounded bg-k-100" />
              <div className="h-3 w-40 rounded bg-k-100" />
            </div>
          </div>

          {/* 우측 화살표 자리 */}
          <div className="flex items-center">
            <div className="h-5 w-5 rounded bg-k-100" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default UniversityCardsSkeleton;
