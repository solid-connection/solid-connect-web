const MentorTabSkeleton = () => (
  <div className="mb-5 flex gap-2" aria-hidden="true">
    <div className="h-9 flex-1 animate-pulse rounded-full bg-k-50" />
    <div className="h-9 flex-1 animate-pulse rounded-full bg-k-50" />
  </div>
);

export const MentorChatCardsSkeleton = ({ count = 2 }: { count?: number }) => (
  <div className="space-y-2" aria-hidden="true">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="flex h-16 w-full items-center gap-3 rounded-lg bg-k-0 px-3 py-4 shadow-sdwB">
        <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-k-50" />
        <div className="min-w-0 flex-1 animate-pulse">
          <div className="mb-2 h-4 w-24 rounded bg-k-50" />
          <div className="h-3 w-2/3 rounded bg-k-50" />
        </div>
      </div>
    ))}
  </div>
);

export const MentorCardListSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-4 pb-28" aria-hidden="true">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="rounded-lg bg-white px-4 pt-4 pb-3 shadow-sdwB">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-k-50" />
          <div className="min-w-0 flex-1 animate-pulse">
            <div className="mb-2 h-4 w-16 rounded bg-k-50" />
            <div className="mb-2 h-5 w-28 rounded bg-k-50" />
            <div className="h-4 w-40 rounded bg-k-50" />
          </div>
        </div>
        <div className="mt-4 border-t border-t-k-50 pt-2">
          <div className="mx-auto h-5 w-7 animate-pulse rounded bg-k-50" />
        </div>
      </div>
    ))}
  </div>
);

export const MentorApplicantListSkeleton = ({ count = 4 }: { count?: number }) => (
  <div aria-hidden="true">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="flex w-full items-start gap-3 border-b border-k-50 p-4">
        <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-k-50" />
        <div className="flex-1 animate-pulse">
          <div className="mb-2 h-4 w-3/4 rounded bg-k-50" />
          <div className="h-3 w-1/2 rounded bg-k-50" />
        </div>
        <div className="h-5 w-5 animate-pulse rounded bg-k-50" />
      </div>
    ))}
  </div>
);

const MentorFindSectionSkeleton = () => (
  <section>
    <div className="mb-3 h-6 w-24 animate-pulse rounded bg-k-50" />
    <div className="mb-3 flex gap-2 overflow-hidden">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-8 w-16 shrink-0 animate-pulse rounded-2xl bg-k-50" />
      ))}
    </div>
    <MentorCardListSkeleton />
  </section>
);

const MentorPageSkeleton = () => (
  <div role="status" aria-label="멘토 페이지 정보를 불러오는 중입니다">
    <MentorTabSkeleton />
    <div className="mb-3 mt-5 flex items-center justify-between">
      <div className="h-6 w-36 animate-pulse rounded bg-k-50" />
      <div className="h-5 w-14 animate-pulse rounded bg-k-50" />
    </div>
    <MentorChatCardsSkeleton />
    <div className="my-8 h-1.5 w-full bg-k-50" />
    <MentorFindSectionSkeleton />
  </div>
);

export default MentorPageSkeleton;
