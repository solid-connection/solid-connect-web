const NewsSectionSkeleton = () => (
  <div className="mt-6 pl-5">
    <div className="mb-2.5 h-5 w-40 animate-pulse rounded bg-k-50" />
    <div className="flex flex-col gap-4">
      {[...Array(3)].map((_, idx) => (
        <div key={idx} className="h-[100px] animate-pulse rounded-xl bg-k-50" />
      ))}
    </div>
  </div>
);

export default NewsSectionSkeleton;
