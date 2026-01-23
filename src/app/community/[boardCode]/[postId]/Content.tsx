import type { Metadata } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDeleteLike, usePostLike } from "@/apis/community";
import LinkifyText from "@/components/ui/LinkifyText";
import { IconCloseFilled, IconPostLikeFilled, IconPostLikeOutline } from "@/public/svgs";
import { IconCommunication } from "@/public/svgs/community";
import type { PostImage as PostImageType, Post as PostType } from "@/types/community";
import { convertISODateToDateTime } from "@/utils/datetimeUtils";
import { convertUploadedImageUrl } from "@/utils/fileUtils";

export const metadata: Metadata = {
  title: "글 상세보기",
};

type ContentProps = {
  post: PostType;
  postId: number;
};

const Content = ({ post, postId }: ContentProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const postLikeMutation = usePostLike();
  const deleteLikeMutation = useDeleteLike();

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
    if (isLiked) {
      setLikeCount((prev) => prev - 1);
      setIsLiked(false);
      deleteLikeMutation.mutate(postId, {
        onSuccess: (data) => {
          setLikeCount(data.likeCount);
          setIsLiked(data.isLiked);
        },
        onError: () => {
          // 롤백
          setLikeCount((prev) => prev + 1);
          setIsLiked(true);
        },
      });
    } else {
      setLikeCount((prev) => prev + 1);
      setIsLiked(true);
      postLikeMutation.mutate(postId, {
        onSuccess: (data) => {
          setLikeCount(data.likeCount);
          setIsLiked(data.isLiked);
        },
        onError: () => {
          // 롤백
          setLikeCount((prev) => prev - 1);
          setIsLiked(false);
        },
      });
    }
  };

  return (
    <>
      <div className="pb-3 pl-5 pt-6">
        <div className="inline-flex rounded-full bg-primary px-3 py-[5px] font-serif text-white typo-medium-2">
          {post.postCategory || "카테고리"}
        </div>
        <div className="mt-4 font-serif text-black typo-sb-4">{post.title || ""}</div>
        <div className="mr-5 mt-3 whitespace-pre-wrap break-all font-serif text-gray-850 typo-regular-2">
          <LinkifyText>{post.content || ""}</LinkifyText>
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
            <span className="overflow-hidden font-serif text-gray-500 typo-regular-4">{likeCount || 0}</span>
          </button>
          <div className="flex items-center gap-1">
            <IconCommunication />
            <span className="overflow-hidden font-serif text-gray-500 typo-regular-4">{post?.commentCount || 0}</span>
          </div>
        </div>
      </div>

      <div className="flex h-16 items-center justify-between border-y border-gray-c-100 px-5 py-3">
        <div className="flex gap-2.5">
          <div className="h-10 w-10 rounded-full bg-bg-600">
            <Image
              className="h-full w-full rounded-full object-cover"
              src={
                post.postFindSiteUserResponse.profileImageUrl
                  ? convertUploadedImageUrl(post.postFindSiteUserResponse.profileImageUrl)
                  : "/images/placeholder/profile64.svg"
              }
              width={40}
              height={40}
              alt=""
            />
          </div>
          <div className="flex flex-col">
            <div className="overflow-hidden text-ellipsis font-serif text-black typo-medium-2">
              {post.postFindSiteUserResponse.nickname || ""}
            </div>
            <div className="overflow-hidden font-serif text-gray-250 typo-regular-4">
              {convertISODateToDateTime(post.createdAt) || ""}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Content;

const PostImage = ({ images, onImageClick }: { images: PostImageType[]; onImageClick: (index: number) => void }) => {
  if (images.length === 1) {
    return (
      <div className="mb-3 pr-5">
        <div className="relative pt-[75%]">
          <Image
            src={convertUploadedImageUrl(images[0].url)}
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
            src={convertUploadedImageUrl(image.url)}
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
    <div className="flex h-14 items-center justify-between bg-white/15">
      <button
        className="ml-5 h-6 w-6 cursor-pointer border-0 bg-none p-0"
        onClick={onClose}
        type="button"
        aria-label="뒤로가기"
      >
        <IconCloseFilled />
      </button>
      <span className="text-white/87 mr-6 font-serif typo-sb-7">{title}</span>
      <div />
    </div>
    <div className="relative flex-grow">
      <Image src={convertUploadedImageUrl(image.url)} layout="fill" objectFit="contain" alt="Popup" />
    </div>
  </div>
);
