"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import Link from "next/link";
import { useRef } from "react";
import Image from "@/components/ui/FallbackImage";
import { IconPostLikeOutline } from "@/public/svgs";
import { IconCommunication } from "@/public/svgs/community";
import type { ListPost } from "@/types/community";
import { normalizeImageUrlToUploadCdn } from "@/utils/cdnUrl";
import { convertISODateToDate } from "@/utils/datetimeUtils";

type PostCardsProps = {
  posts: ListPost[];
  boardCode: string;
  variant?: "mobile" | "desktop";
};

const PostCards = ({ posts, boardCode, variant = "mobile" }: PostCardsProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const isDesktop = variant === "desktop";

  const virtualizer = useVirtualizer({
    count: posts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => (isDesktop ? 156 : 140),
    overscan: 5,
  });

  if (posts.length === 0) {
    return (
      <div
        className={
          isDesktop
            ? "flex min-h-[420px] items-center justify-center rounded-lg border border-dashed border-k-100 bg-white text-k-400 typo-regular-2"
            : "flex min-h-[320px] items-center justify-center text-k-400 typo-regular-2"
        }
      >
        게시글이 없습니다.
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className={
        isDesktop
          ? "flex flex-col overflow-auto rounded-lg border border-k-100 bg-white"
          : "flex flex-col overflow-auto"
      }
      style={{
        height: isDesktop ? "calc(100vh - 240px)" : "calc(100vh - 220px)",
        contain: "strict",
      }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const post = posts[virtualItem.index];
          return (
            <div
              key={post.id}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
              data-index={virtualItem.index}
            >
              <Link href={`/community/${boardCode}/${post.id}`} className="no-underline">
                <PostCard post={post} priorityImage={virtualItem.index === 0} variant={variant} />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PostCards;

const DEFAULT_THUMBNAIL_PATHS = new Set([
  "/article-thumb.png",
  "/site-thumbnail.png",
  "/images/article-thumb.png",
  "/images/site-thumbnail.png",
]);

const getThumbnailPathname = (thumbnailSrc: string) => {
  try {
    return new URL(thumbnailSrc, "https://solid-connection.local").pathname;
  } catch {
    return thumbnailSrc;
  }
};

const getPostThumbnailSrc = (postThumbnailUrl: string | null) => {
  const thumbnailSrc = normalizeImageUrlToUploadCdn(postThumbnailUrl);
  const thumbnailPathname = getThumbnailPathname(thumbnailSrc);

  if (
    !thumbnailSrc ||
    DEFAULT_THUMBNAIL_PATHS.has(thumbnailPathname) ||
    thumbnailPathname.startsWith("/svgs/placeholders/")
  ) {
    return null;
  }

  return thumbnailSrc;
};

export const PostCard = ({
  post,
  priorityImage = false,
  variant = "mobile",
}: {
  post: ListPost;
  priorityImage?: boolean;
  variant?: "mobile" | "desktop";
}) => {
  const thumbnailSrc = getPostThumbnailSrc(post.postThumbnailUrl);
  const isDesktop = variant === "desktop";

  return (
    <div
      className={
        isDesktop
          ? "flex h-full justify-between border-b border-b-gray-c-100 px-6 py-5 transition-colors hover:bg-k-50"
          : "flex justify-between border-b border-b-gray-c-100 px-5 py-4"
      }
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center truncate font-serif text-gray-250">
          <span className="typo-bold-5">{post.postCategory || ""}</span>
          <span className="ml-2.5 typo-regular-4">{convertISODateToDate(post.createdAt) || "1970. 1. 1."}</span>
        </div>
        <span
          className={
            isDesktop ? "mt-2 truncate font-serif text-black typo-sb-4" : "mt-2 font-serif text-black typo-sb-7"
          }
        >
          {post.title || ""}
        </span>
        <div
          className={
            isDesktop
              ? "mt-2 line-clamp-2 min-h-11 break-all font-serif text-gray-250 typo-medium-2"
              : "mt-1 h-11 overflow-hidden text-ellipsis break-all font-serif text-gray-250 typo-medium-2"
          }
        >
          {post.content || "내용 없음"}
        </div>
        <div className="mt-1 flex items-center gap-2.5">
          <div className="flex items-center gap-1">
            <IconPostLikeOutline />
            <span className="overflow-hidden font-serif text-gray-500 typo-regular-4">{post.likeCount || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <IconCommunication />
            <span className="overflow-hidden font-serif text-gray-500 typo-regular-4">{post.commentCount || 0}</span>
          </div>
        </div>
      </div>

      {thumbnailSrc ? (
        <div className={isDesktop ? "ml-6 h-24 w-24 shrink-0 select-none" : "ml-4 mt-3 h-20 w-20 shrink-0 select-none"}>
          <div className="bg-gray-c-50 relative h-full w-full overflow-hidden rounded border border-k-100">
            <Image
              className="object-cover"
              src={thumbnailSrc}
              fill
              sizes={isDesktop ? "96px" : "80px"}
              alt="게시글 사진"
              fallbackSrc="/images/article-thumb.png"
              loading={priorityImage ? "eager" : undefined}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};
