"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { convertISODateToDate } from "@/utils/datetimeUtils";
import { convertUploadedImageUrl } from "@/utils/fileUtils";

import { ListPost } from "@/types/community";

import { IconPostLikeOutline } from "@/public/svgs";
import { IconCommunication } from "@/public/svgs/community";
import { IconSolidConnentionLogo } from "@/public/svgs/mentor";

import { useVirtualizer } from "@tanstack/react-virtual";

type PostCardsProps = {
  posts: ListPost[];
  boardCode: string;
};

const PostCards = ({ posts, boardCode }: PostCardsProps) => {
  const parentRef = useRef<HTMLDivElement>(null);

  // 가상화 설정
  const virtualizer = useVirtualizer({
    count: posts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 140, // 각 PostCard의 예상 높이 (px)
    overscan: 5, // 화면 밖에 미리 렌더링할 항목 수
  });

  return (
    <div
      ref={parentRef}
      className="flex flex-col overflow-auto"
      style={{
        height: "calc(100vh - 220px)", // 헤더, 탭 등을 제외한 높이
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
                <PostCard post={post} />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PostCards;

export const PostCard = ({ post }: { post: ListPost }) => (
  <div className="flex justify-between border-b border-b-gray-c-100 px-5 py-4">
    <div className="flex flex-col">
      <div className="flex items-center truncate font-serif text-gray-250">
        <span className="typo-bold-5">{post.postCategory || ""}</span>
        <span className="ml-2.5 typo-regular-4">
          {convertISODateToDate(post.createdAt) || "1970. 1. 1."}
        </span>
      </div>
      <span className="mt-2 font-serif typo-sb-7 text-black">{post.title || ""}</span>
      <div className="mt-1 h-11 overflow-hidden text-ellipsis break-all font-serif typo-medium-2 text-gray-250">
        {post.content || "내용 없음"}
      </div>
      <div className="mt-1 flex items-center gap-2.5">
        <div className="flex items-center gap-1">
          <IconPostLikeOutline />
          <span className="overflow-hidden font-serif typo-regular-4 text-gray-500">
            {post.likeCount || 0}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <IconCommunication />
          <span className="overflow-hidden font-serif typo-regular-4 text-gray-500">
            {post.commentCount || 0}
          </span>
        </div>
      </div>
    </div>

    <div className="ml-4 mt-3 h-20 w-20 select-none">
      {post.postThumbnailUrl ? (
        <Image
          className="rounded-md object-cover"
          src={convertUploadedImageUrl(post.postThumbnailUrl)}
          height={82}
          width={82}
          alt="게시글 사진"
        />
      ) : (
        <div className="bg-gray-c-50 flex h-20 w-20 items-center justify-center rounded border border-k-100">
          <IconSolidConnentionLogo />
        </div>
      )}
    </div>
  </div>
);
