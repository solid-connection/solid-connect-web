import Image from "next/image";
import { useEffect, useState } from "react";
import ReactLinkify from "react-linkify";

import { likePostApi, unlikePostApi } from "@/services/community";
import { convertISODateToDateTime } from "@/utils/datetimeUtils";

import { PostImage as PostImageType, Post as PostType } from "@/types/community";

import { IconCloseFilled, IconPostLikeFilled, IconPostLikeOutline } from "@/public/svgs";
import { IconCommunication } from "@/public/svgs/community";

type PostProps = {
  post: PostType;
  boardCode: string;
  postId: number;
};

const Post = ({ post, boardCode, postId }: PostProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  useEffect(() => {
    if (post) {
      setLikeCount(post.likeCount);
      setIsLiked(post.isLiked);
    }
  }, [post]);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closePopup = () => {
    setSelectedImageIndex(null);
  };

  const toggleLike = async () => {
    try {
      if (isLiked) {
        setLikeCount((prev) => prev - 1);
        setIsLiked(false);
        const res = await unlikePostApi(postId);
        setLikeCount(res.data.likeCount);
        setIsLiked(res.data.isLiked);
      } else {
        setLikeCount((prev) => prev + 1);
        setIsLiked(true);
        const res = await likePostApi(postId);
        setLikeCount(res.data.likeCount);
        setIsLiked(res.data.isLiked);
      }
    } catch (err) {
      if (err.response) {
        console.error("Axios response error", err.response);
        if (err.response.status === 401 || err.response.status === 403) {
          alert("로그인이 필요합니다");
          document.location.href = "/login";
        } else {
          alert(err.response.data?.message);
        }
      } else {
        console.error("Error", err.message);
      }
    }
  };

  return (
    <>
      <div className="pb-3 pl-5 pt-6">
        <div className="inline-flex rounded-full bg-secondary px-3 py-[5px] font-serif text-sm font-medium leading-[160%] text-white">
          {post.postCategory || "카테고리"}
        </div>
        <div className="mt-4 font-serif text-xl font-semibold leading-6 text-black">{post.title || ""}</div>
        <div className="mr-5 mt-3 whitespace-pre-wrap break-all font-serif text-sm font-normal leading-normal text-[#1a1a1a]">
          <ReactLinkify>{post.content || ""}</ReactLinkify>
        </div>

        <div className="mt-3">
          <PostImage images={post.postFindPostImageResponses || []} onImageClick={handleImageClick} />
        </div>
        {selectedImageIndex !== null && (
          <ImagePopup
            image={post.postFindPostImageResponses[selectedImageIndex]}
            title={`${selectedImageIndex + 1}/${post.postFindPostImageResponses.length}`}
            onClose={closePopup}
          />
        )}

        <div className="mt-5 flex items-center gap-2.5">
          <button className="flex cursor-pointer items-center gap-1" onClick={toggleLike} type="button">
            {isLiked ? <IconPostLikeFilled /> : <IconPostLikeOutline />}
            <span className="overflow-hidden font-serif text-xs font-normal leading-normal text-[#595959]">
              {likeCount || 0}
            </span>
          </button>
          <div className="flex items-center gap-1">
            <IconCommunication />
            <span className="overflow-hidden font-serif text-xs font-normal leading-normal text-[#595959]">
              {post?.commentCount || 0}
            </span>
          </div>
        </div>
      </div>

      <div className="flex h-16 items-center justify-between border-y border-gray-c-100 px-5 py-3">
        <div className="flex gap-2.5">
          <div className="h-10 w-10 rounded-full bg-[#d9d9d9]">
            <Image
              className="h-full w-full rounded-full"
              src={
                post.postFindSiteUserResponse.profileImageUrl
                  ? `${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${post.postFindSiteUserResponse.profileImageUrl}`
                  : "/images/placeholder/profile64.svg"
              }
              width={40}
              height={40}
              alt=""
            />
          </div>
          <div className="flex flex-col">
            <div className="overflow-hidden text-ellipsis font-serif text-sm font-medium leading-normal text-black">
              {post.postFindSiteUserResponse.nickname || ""}
            </div>
            <div className="overflow-hidden font-serif text-xs font-normal leading-normal text-[#7c7c7c]">
              {convertISODateToDateTime(post.createdAt) || ""}
            </div>
          </div>
        </div>

        <button
          className="h-[31px] cursor-pointer rounded-full bg-[#f0f0f0] px-3 py-[5px] font-serif text-[13px] font-medium leading-[160%] tracking-[0.15px] text-[#a2a2a2]"
          type="button"
        >
          채팅보내기
        </button>
      </div>
    </>
  );
};

export default Post;

const PostImage = ({ images, onImageClick }: { images: PostImageType[]; onImageClick: (index: number) => void }) => {
  if (images.length === 1) {
    return (
      <div className="mb-3 pr-5">
        <div className="relative pt-[75%]">
          <Image
            src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${images[0].url}`}
            layout="fill"
            objectFit="cover"
            alt="image"
            onClick={() => onImageClick(0)}
          />
        </div>
      </div>
    );
  }
  return (
    <div className="w-full overflow-x-auto whitespace-nowrap">
      <div className="flex gap-3">
        {images.map((image, index) => (
          <Image
            key={image.id}
            src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${image.url}`}
            width={197}
            height={197}
            alt="image"
            onClick={() => onImageClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

type ImagePopupProps = {
  image: PostImageType;
  title: string;
  onClose: () => void;
};

const ImagePopup = ({ image, title, onClose }: ImagePopupProps) => (
  <div className="fixed left-0 top-0 z-[1000] flex h-full w-full flex-col bg-black">
    <div className="flex h-14 items-center justify-between bg-[rgba(255,255,255,0.15)]">
      <button
        className="ml-5 h-6 w-6 cursor-pointer border-0 bg-none p-0"
        onClick={onClose}
        type="button"
        aria-label="뒤로가기"
      >
        <IconCloseFilled />
      </button>
      <span className="mr-6 font-serif text-base font-semibold leading-[160%] text-[rgba(255,255,255,0.87)]">
        {title}
      </span>
      <div />
    </div>
    <div className="relative flex-grow">
      <Image
        src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${image.url}`}
        layout="fill"
        objectFit="contain"
        alt="Popup"
      />
    </div>
  </div>
);
