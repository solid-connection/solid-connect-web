import clsx from "clsx";

type UniversityListSkeletonProps = {
  /** 표시할 카드 개수 (기본 3개) */
  cardCount?: number;
  /** 표시할 탭 개수 (기본 4개) */
  tabCount?: number;
  style?: React.CSSProperties;
  className?: string;
};

/** UniversityList 전체 로딩 상태 Skeleton */
const UniversityListSkeleton = ({ cardCount = 3, tabCount = 4, style, className }: UniversityListSkeletonProps) => (
  <div className={clsx("flex flex-col gap-2", className)} style={style}>
    {/* 제목 플레이스홀더 */}
    <div className="h-6 w-40 animate-pulse rounded bg-k-50" />

    {/* ButtonTab 플레이스홀더 */}
    <div className="flex flex-row gap-2 overflow-x-auto">
      {[...Array(tabCount)].map((_, idx) => (
        <div key={idx} className="h-8 w-20 shrink-0 animate-pulse rounded-full bg-k-50" />
      ))}
    </div>

    {/* 카드 리스트 플레이스홀더 */}
    <div className="flex flex-col gap-2.5">
      {[...Array(cardCount)].map((_, idx) => (
        <div
          key={idx}
          className="relative h-[91px] animate-pulse overflow-hidden rounded-lg border border-solid border-k-100 bg-k-50"
        >
          <div className="flex h-full justify-between px-5 py-3.5">
            {/* 썸네일 자리 */}
            <div className="flex gap-[23.5px]">
              <div className="flex flex-shrink-0 items-center">
                <div className="h-14 w-14 rounded-full bg-k-100" />
              </div>
              {/* 텍스트 3줄 */}
              <div className="flex flex-col justify-center gap-2">
                <div className="h-4 w-32 rounded bg-k-100" />
                <div className="h-3 w-48 rounded bg-k-100" />
                <div className="h-3 w-40 rounded bg-k-100" />
              </div>
            </div>
            {/* 화살표 자리 */}
            <div className="flex items-center">
              <div className="h-5 w-5 rounded bg-k-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default UniversityListSkeleton;
