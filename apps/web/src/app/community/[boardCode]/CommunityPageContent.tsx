"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useGetPostList } from "@/apis/community";
import { COMMUNITY_INITIAL_CATEGORY } from "@/apis/community/postListQuery";
import ButtonTab from "@/components/ui/ButtonTab";
import { COMMUNITY_BOARDS, COMMUNITY_CATEGORIES } from "@/constants/community";
import useAuthStore from "@/lib/zustand/useAuthStore";
import useReportedPostsStore from "@/lib/zustand/useReportedPostsStore";
import type { ListPost } from "@/types/community";
import { buildLoginPathWithRedirect } from "@/utils/authRedirect";
import useIsDesktopViewport from "@/utils/useIsDesktopViewport";
import { CommunityPostListSkeleton } from "./CommunityPageSkeleton";
import CommunityRegionSelector from "./CommunityRegionSelector";
import PostCards from "./PostCards";
import PostWriteButton from "./PostWriteButton";

interface CommunityPageContentProps {
  boardCode: string;
}

const CommunityPageContent = ({ boardCode }: CommunityPageContentProps) => {
  const router = useRouter();
  const [category, setCategory] = useState<string | null>(COMMUNITY_INITIAL_CATEGORY);
  const reportedPostIds = useReportedPostsStore((state) => state.reportedPostIds);
  const blockedUserIds = useReportedPostsStore((state) => state.blockedUserIds);
  const blockedPostIds = useReportedPostsStore((state) => state.blockedPostIds);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const refreshStatus = useAuthStore((state) => state.refreshStatus);
  const isDesktop = useIsDesktopViewport();

  const { data: posts = [], isPending } = useGetPostList({
    boardCode,
    category,
  });

  const visiblePosts = useMemo(() => {
    if (reportedPostIds.length === 0 && blockedUserIds.length === 0 && blockedPostIds.length === 0) {
      return posts;
    }

    const reportedIdSet = new Set(reportedPostIds);
    const blockedUserIdSet = new Set(blockedUserIds);
    const blockedPostIdSet = new Set(blockedPostIds);

    return posts.filter((post) => {
      if (reportedIdSet.has(post.id) || blockedPostIdSet.has(post.id)) {
        return false;
      }

      const authorId = post.postFindSiteUserResponse?.id;

      if (typeof authorId === "number" && blockedUserIdSet.has(authorId)) {
        return false;
      }

      return true;
    });
  }, [posts, reportedPostIds, blockedUserIds, blockedPostIds]);

  const handleBoardChange = (newBoard: string) => {
    router.push(`/community/${newBoard}`);
  };

  const postWriteHandler = () => {
    const createPath = `/community/${boardCode}/create`;

    if (!isInitialized || refreshStatus === "refreshing") {
      return;
    }

    const nextPath = isAuthenticated && accessToken ? createPath : buildLoginPathWithRedirect(createPath);

    router.push(nextPath);
  };

  const getBoardNameKo = (code: string) => {
    return COMMUNITY_BOARDS.find((board) => board.code === code)?.nameKo ?? "";
  };
  const boardName = getBoardNameKo(boardCode);
  const viewProps = {
    boardCode,
    boardName,
    category,
    setCategory,
    visiblePosts,
    isPending,
    handleBoardChange,
    postWriteHandler,
  };

  if (isDesktop === null) {
    return <div aria-hidden className="min-h-screen bg-white md:bg-k-50" />;
  }

  return isDesktop ? <CommunityDesktopView {...viewProps} /> : <CommunityMobileView {...viewProps} />;
};

type CommunityViewProps = {
  boardCode: string;
  boardName: string;
  category: string | null;
  setCategory: React.Dispatch<React.SetStateAction<string | null>>;
  visiblePosts: ListPost[];
  isPending: boolean;
  handleBoardChange: (newBoard: string) => void;
  postWriteHandler: () => void;
};

const CommunityMobileView = ({
  boardCode,
  boardName,
  category,
  setCategory,
  visiblePosts,
  isPending,
  handleBoardChange,
  postWriteHandler,
}: CommunityViewProps) => {
  return (
    <div>
      <CommunityRegionSelector
        curRegion={boardName}
        setCurRegion={handleBoardChange}
        regionChoices={COMMUNITY_BOARDS}
      />
      <ButtonTab
        choices={COMMUNITY_CATEGORIES}
        choice={category}
        setChoice={setCategory}
        style={{ padding: "10px 0 10px 18px" }}
      />
      {isPending ? <CommunityPostListSkeleton /> : <PostCards posts={visiblePosts} boardCode={boardCode} />}
      <PostWriteButton onClick={postWriteHandler} />
    </div>
  );
};

const CommunityDesktopView = ({
  boardCode,
  boardName,
  category,
  setCategory,
  visiblePosts,
  isPending,
  handleBoardChange,
  postWriteHandler,
}: CommunityViewProps) => {
  return (
    <div className="min-h-screen bg-k-50 px-8 py-8 lg:px-10">
      <header className="mb-8 flex items-end justify-between gap-6">
        <div>
          <p className="text-primary typo-sb-9">Community</p>
          <h1 className="mt-2 text-k-900 typo-bold-1">{boardName || "커뮤니티"} 게시판</h1>
          <p className="mt-2 text-k-500 typo-medium-2">
            교환학생 준비와 파견 생활에 필요한 이야기를 주제별로 살펴보세요.
          </p>
        </div>
        <button
          type="button"
          onClick={postWriteHandler}
          className="rounded-lg bg-primary px-5 py-3 text-white transition-colors typo-sb-9 hover:bg-primary-700"
        >
          글쓰기
        </button>
      </header>

      <div className="grid items-start gap-8 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="sticky top-8 space-y-5">
          <section className="rounded-lg border border-k-100 bg-white p-5">
            <h2 className="text-k-900 typo-bold-4">게시판</h2>
            <div className="mt-4 grid gap-2">
              {COMMUNITY_BOARDS.map((board) => {
                const isActive = board.code === boardCode;

                return (
                  <button
                    key={board.code}
                    type="button"
                    onClick={() => handleBoardChange(board.code)}
                    className={clsx(
                      "flex items-center justify-between rounded-lg px-4 py-3 text-left transition-colors typo-medium-2",
                      isActive ? "bg-primary-100 text-primary" : "bg-k-50 text-k-700 hover:bg-k-100",
                    )}
                  >
                    <span>{board.nameKo}</span>
                    {isActive && <span className="typo-sb-11">선택됨</span>}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-lg border border-k-100 bg-white p-5">
            <h2 className="text-k-900 typo-bold-4">카테고리</h2>
            <div className="mt-4 grid gap-2">
              {COMMUNITY_CATEGORIES.map((item) => {
                const isActive = item === category;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory((prev) => (prev === item ? null : item))}
                    className={clsx(
                      "rounded-lg px-4 py-3 text-left transition-colors typo-medium-2",
                      isActive ? "bg-primary text-white" : "bg-k-50 text-k-600 hover:bg-k-100",
                    )}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </section>
        </aside>

        <main className="min-w-0">
          <section className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-k-900 typo-bold-4">게시글</h2>
              <p className="mt-1 text-k-500 typo-medium-4">
                총 <span className="text-primary typo-sb-9">{visiblePosts.length}</span>개
              </p>
            </div>
            <span className="rounded-full bg-white px-4 py-2 text-k-500 typo-medium-4">
              {category ?? "전체 카테고리"}
            </span>
          </section>

          {isPending ? (
            <CommunityPostListSkeleton />
          ) : (
            <PostCards posts={visiblePosts} boardCode={boardCode} variant="desktop" />
          )}
        </main>
      </div>
    </div>
  );
};

export default CommunityPageContent;
