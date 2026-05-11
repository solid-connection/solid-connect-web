const HomeEntrySectionSkeleton = () => (
  <div className="px-5 py-5">
    <div className="mb-4 h-7 w-32 animate-pulse rounded bg-k-50" />

    <div className="mb-3 flex gap-2 overflow-x-auto">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="h-9 w-16 shrink-0 animate-pulse rounded-full bg-k-50" />
      ))}
    </div>

    <div className="flex flex-col gap-2">
      <div className="h-[52px] animate-pulse rounded-lg bg-k-50" />
      <div className="h-[52px] animate-pulse rounded-lg bg-k-50" />
    </div>

    <div className="mt-3 h-14 animate-pulse rounded-lg bg-k-50" />
  </div>
);

export default HomeEntrySectionSkeleton;
