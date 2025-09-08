"use client";

import Image from "next/image";
import Link from "next/link";

import { convertISODateToDate } from "@/utils/datetimeUtils";
import { convertUploadedImageUrl } from "@/utils/fileUtils";

import { ListPost } from "@/types/community";

import { IconPostLikeOutline } from "@/public/svgs";
import { IconCommunication } from "@/public/svgs/community";
import { IconSolidConnentionLogo } from "@/public/svgs/mentor";

type PostCardsProps = {
  posts: ListPost[];
  boardCode: string;
};

const PostCards = ({ posts, boardCode }: PostCardsProps) => (
  <div className="flex flex-col">
    {posts.map((post) => (
      <Link href={`/community/${boardCode}/${post.id}`} className="no-underline" key={post.id}>
        <PostCard post={post} />
      </Link>
    ))}
  </div>
);

export default PostCards;

export const PostCard = ({ post }: { post: ListPost }) => (
  <div className="flex justify-between border-b border-b-gray-c-100 px-5 py-4">
    <div className="flex flex-col">
      <div className="flex items-center truncate font-serif text-[#7c7c7c]">
        <span className="text-sm font-extrabold leading-normal">{post.postCategory || ""}</span>
        <span className="ml-2.5 text-xs font-normal leading-normal">
          {convertISODateToDate(post.createdAt) || "1970. 1. 1."}
        </span>
      </div>
      <span className="mt-2 font-serif text-base font-semibold leading-5 text-black">{post.title || ""}</span>
      <div className="mt-1 h-11 overflow-hidden text-ellipsis break-all font-serif text-sm font-medium leading-normal text-[#7c7c7c]">
        {post.content || "내용 없음"}
      </div>
      <div className="mt-1 flex items-center gap-2.5">
        <div className="flex items-center gap-1">
          <IconPostLikeOutline />
          <span className="overflow-hidden font-serif text-xs font-normal leading-normal text-[#595959]">
            {post.likeCount || 0}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <IconCommunication />
          <span className="overflow-hidden font-serif text-xs font-normal leading-normal text-[#595959]">
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
        <IconSolidConnentionLogo />
      )}
    </div>
  </div>
);
