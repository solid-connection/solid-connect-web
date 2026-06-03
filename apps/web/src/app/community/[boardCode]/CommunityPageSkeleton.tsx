const TAB_SKELETON_WIDTHS = ["w-12", "w-12", "w-12"];

export const CommunityPostListSkeleton = ({ itemCount = 5 }: { itemCount?: number }) => (
  <div
    className="flex flex-col overflow-hidden"
    style={{
      height: "calc(100vh - 220px)",
    }}
    aria-hidden="true"
  >
    {Array.from({ length: itemCount }).map((_, index) => (
      <div key={index} className="flex justify-between border-b border-b-gray-c-100 px-5 py-4">
        <div className="min-w-0 flex-1 animate-pulse">
          <div className="flex items-center gap-2.5">
            <div className="h-4 w-9 rounded bg-k-50" />
            <div className="h-4 w-20 rounded bg-k-50" />
          </div>
          <div className="mt-3 h-5 w-3/4 rounded bg-k-50" />
          <div className="mt-2 h-4 w-full rounded bg-k-50" />
          <div className="mt-1.5 h-4 w-2/3 rounded bg-k-50" />
          <div className="mt-3 flex gap-2.5">
            <div className="h-4 w-8 rounded bg-k-50" />
            <div className="h-4 w-8 rounded bg-k-50" />
          </div>
        </div>
        <div className="ml-4 mt-3 h-20 w-20 shrink-0 animate-pulse rounded border border-k-100 bg-k-50" />
      </div>
    ))}
  </div>
);

const CommunityPageSkeleton = () => (
  <div role="status" aria-label="커뮤니티 게시글을 불러오는 중입니다">
    <div className="pb-3.5 pl-5 pt-5">
      <div className="h-7 w-24 animate-pulse rounded bg-k-50" />
    </div>
    <div className="flex gap-2 overflow-hidden px-[18px] py-2.5">
      {TAB_SKELETON_WIDTHS.map((width, index) => (
        <div key={`${width}-${index}`} className={`${width} h-8 shrink-0 animate-pulse rounded-full bg-k-50`} />
      ))}
    </div>
    <CommunityPostListSkeleton />
  </div>
);

export default CommunityPageSkeleton;
