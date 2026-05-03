"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useCreatePost } from "@/apis/community";
import useCommunityImageUpload from "@/app/community/_hooks/useCommunityImageUpload";
import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import { IconImage, IconPostCheckboxFilled, IconPostCheckboxOutlined } from "@/public/svgs";

type PostFormProps = {
  boardCode: string;
};

const PostForm = ({ boardCode }: PostFormProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<string>("");
  const router = useRouter();
  const [isQuestion, setIsQuestion] = useState<boolean>(false);
  const {
    maxImages,
    imageUploadRef,
    selectedImages,
    imagePreviewUrls,
    isDraggingImage,
    handleImageChange,
    handleImageDragEnter,
    handleImageDragOver,
    handleImageDragLeave,
    handleImageDrop,
    removeSelectedImage,
    openImagePicker,
  } = useCommunityImageUpload();

  const createPostMutation = useCreatePost();

  useEffect(() => {
    const textarea = textareaRef.current;
    const title = titleRef.current;

    if (textarea && title) {
      const adjustHeight = () => {
        textarea.style.height = "auto";
        const { scrollHeight } = textarea;
        const newHeight = scrollHeight <= 50 ? 50 : Math.min(scrollHeight, 100);
        textarea.style.height = `${newHeight}px`;
        title.style.height = `${newHeight}px`;
      };

      textarea.addEventListener("input", adjustHeight);

      // 초기 높이 설정
      adjustHeight();

      return () => textarea.removeEventListener("input", adjustHeight);
    }
    return () => {};
  }, []);

  const submitPost = async () => {
    const titleValue = titleRef.current?.querySelector("textarea")?.value.trim() || "";
    const trimmedContent = content.trim();

    if (!titleValue) {
      toast.error("제목을 입력해주세요.");
      return;
    }

    if (!trimmedContent) {
      toast.error("내용을 입력해주세요.");
      return;
    }

    if (trimmedContent.length > 255) {
      toast.error("내용은 255자 이하로 입력해주세요.");
      return;
    }

    createPostMutation.mutate(
      {
        postCreateRequest: {
          boardCode: boardCode,
          postCategory: isQuestion ? "질문" : "자유",
          title: titleValue,
          content: trimmedContent,
          isQuestion,
        },
        file: selectedImages,
      },
      {
        onSuccess: (data) => {
          router.push(`/community/${boardCode}/${data.id}`);
        },
      },
    );
  };

  const noticeTitle = "[글 작성 시 유의사항]";
  const noticeContent =
    "인종, 성별, 출신, 지역, 이념 관련 차별 관련 발언 및 타인에게 불쾌감을 유발할 수 있는 글은 삭제될 수 있습니다.\n\n솔리드 커넥션은 홍보 행위를 철저히 금지합니다.";

  return (
    <>
      <TopDetailNavigation
        title="글쓰기"
        icon={
          <button
            className="h-8 cursor-pointer rounded-full border-0 bg-primary px-3 py-[5px] text-white typo-medium-2"
            onClick={submitPost}
            type="button"
          >
            등록
          </button>
        }
      />
      <div
        className="relative"
        onDragEnter={handleImageDragEnter}
        onDragOver={handleImageDragOver}
        onDragLeave={handleImageDragLeave}
        onDrop={handleImageDrop}
      >
        {isDraggingImage ? (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/40 px-5 text-center text-white typo-sb-9">
            이미지를 놓아 업로드하세요
          </div>
        ) : null}
        <div
          className="relative border-b border-b-gray-c-100 transition-height duration-200 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-gray-c-100"
          ref={titleRef}
        >
          <textarea
            className="placeholder:text-gray-250/87 w-full resize-none overflow-hidden px-5 pb-2.5 pt-5 text-black outline-none transition-height duration-200 typo-sb-4"
            placeholder="제목을 입력하세요"
            maxLength={40}
            rows={1}
            ref={textareaRef}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
              }
            }}
          />
        </div>
        <div className="flex h-[42px] items-center justify-between border-b border-b-gray-c-100 px-5 py-2.5">
          <div className="text-gray-250/87 flex items-center gap-1 typo-regular-2">
            <button onClick={() => setIsQuestion(!isQuestion)} type="button">
              {isQuestion ? <IconPostCheckboxFilled /> : <IconPostCheckboxOutlined />}
            </button>
            질문으로 업로드 하기
          </div>
          <div>
            <button
              onClick={() => {
                openImagePicker();
              }}
              type="button"
              aria-label="이미지 추가"
            >
              <IconImage />
            </button>
            <input
              className="hidden"
              ref={imageUploadRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div>
          <textarea
            className="placeholder:text-gray-250/87 mt-4 box-border h-90 w-full resize-none border-0 px-5 text-black outline-none typo-regular-1"
            placeholder="내용을 입력하세요"
            value={content}
            maxLength={255}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        {imagePreviewUrls.length > 0 ? (
          <div className="px-5 pb-2">
            <p className="mb-2 text-gray-250/87 typo-regular-4">
              첨부 이미지 ({selectedImages.length}/{maxImages})
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {imagePreviewUrls.map((imagePreviewUrl, index) => (
                <div
                  key={`${selectedImages[index]?.name ?? "image"}-${selectedImages[index]?.lastModified ?? index}`}
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border border-gray-c-100"
                >
                  <img
                    src={imagePreviewUrl}
                    alt={`업로드 이미지 미리보기 ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute right-1 top-1 rounded bg-black/60 px-1 py-0.5 text-xs text-white"
                    onClick={() => removeSelectedImage(index)}
                    aria-label={`이미지 ${index + 1} 제거`}
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        <div className="px-5 pt-2.5">
          <p className="text-gray-250/87 typo-sb-9">{noticeTitle}</p>
          <p className="mt-2 whitespace-pre-line text-gray-100 typo-regular-4">{noticeContent}</p>
        </div>
      </div>
    </>
  );
};

export default PostForm;
