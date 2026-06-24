"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCreatePost } from "@/apis/community";
import PostCategorySelector from "@/app/community/_components/PostCategorySelector";
import useCommunityImageUpload from "@/app/community/_hooks/useCommunityImageUpload";
import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";
import { showIconToast } from "@/lib/toast/showIconToast";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { IconImage } from "@/public/svgs";
import { buildLoginPathWithRedirect } from "@/utils/authRedirect";
import useIsDesktopViewport from "@/utils/useIsDesktopViewport";

type PostFormProps = {
  boardCode: string;
};

const PostForm = ({ boardCode }: PostFormProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<string>("");
  const router = useRouter();
  const [postCategory, setPostCategory] = useState<string>("자유");
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const refreshStatus = useAuthStore((state) => state.refreshStatus);
  const isDesktop = useIsDesktopViewport();
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
  const createPath = `/community/${boardCode}/create`;

  useEffect(() => {
    if (!isInitialized || refreshStatus === "refreshing") {
      return;
    }

    if (!isAuthenticated || !accessToken) {
      router.replace(buildLoginPathWithRedirect(createPath));
    }
  }, [accessToken, createPath, isAuthenticated, isInitialized, refreshStatus, router]);

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

  if (!isInitialized || refreshStatus === "refreshing" || !isAuthenticated || !accessToken || isDesktop === null) {
    return <CloudSpinnerPage />;
  }

  const submitPost = async () => {
    const titleValue = titleRef.current?.querySelector("textarea")?.value.trim() || "";
    const trimmedContent = content.trim();

    if (!titleValue) {
      showIconToast("logo", "제목을 입력해주세요.");
      return;
    }

    if (!trimmedContent) {
      showIconToast("logo", "내용을 입력해주세요.");
      return;
    }

    if (trimmedContent.length > 255) {
      showIconToast("logo", "내용은 255자 이하로 입력해주세요.");
      return;
    }

    createPostMutation.mutate(
      {
        postCreateRequest: {
          boardCode: boardCode,
          postCategory,
          title: titleValue,
          content: trimmedContent,
          isQuestion: postCategory === "질문",
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

  const editor = (
    <div
      className={clsx("relative", isDesktop && "overflow-hidden rounded-lg border border-k-100 bg-white")}
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
          className={clsx(
            "placeholder:text-gray-250/87 w-full resize-none overflow-hidden text-black outline-none transition-height duration-200 typo-sb-4",
            isDesktop ? "px-6 pb-3 pt-6" : "px-5 pb-2.5 pt-5",
          )}
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
      <div
        className={clsx(
          "flex h-[42px] items-center justify-between gap-3 border-b border-b-gray-c-100 py-2.5",
          isDesktop ? "px-6" : "px-5",
        )}
      >
        <PostCategorySelector value={postCategory} onChange={setPostCategory} />
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
          className={clsx(
            "placeholder:text-gray-250/87 mt-4 box-border w-full resize-none border-0 text-black outline-none typo-regular-1",
            isDesktop ? "h-[360px] px-6" : "h-90 px-5",
          )}
          placeholder="내용을 입력하세요"
          value={content}
          maxLength={255}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      {imagePreviewUrls.length > 0 ? (
        <div className={clsx("pb-2", isDesktop ? "px-6" : "px-5")}>
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
      {!isDesktop && (
        <div className="px-5 pt-2.5">
          <p className="text-gray-250/87 typo-sb-9">{noticeTitle}</p>
          <p className="mt-2 whitespace-pre-line text-gray-100 typo-regular-4">{noticeContent}</p>
        </div>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <div className="min-h-screen bg-k-50 px-8 py-8 lg:px-10">
        <header className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-primary typo-sb-9">Community</p>
            <h1 className="mt-2 text-k-900 typo-bold-1">글쓰기</h1>
            <p className="mt-2 text-k-500 typo-medium-2">게시판에 공유할 이야기와 이미지를 작성하세요.</p>
          </div>
          <button
            className="rounded-lg bg-primary px-5 py-3 text-white transition-colors typo-sb-9 hover:bg-primary-700"
            onClick={submitPost}
            type="button"
          >
            등록
          </button>
        </header>

        <div className="grid items-start gap-8 xl:grid-cols-[minmax(520px,760px)_minmax(280px,360px)]">
          {editor}
          <aside className="sticky top-8 rounded-lg border border-k-100 bg-white p-6">
            <h2 className="text-k-900 typo-bold-4">{noticeTitle}</h2>
            <p className="mt-5 whitespace-pre-line text-k-600 typo-medium-3">{noticeContent}</p>
            <div className="mt-6 rounded-lg bg-k-50 p-4 text-k-500 typo-regular-2">
              첨부 이미지 {selectedImages.length}/{maxImages}
            </div>
          </aside>
        </div>
      </div>
    );
  }

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
      {editor}
    </>
  );
};

export default PostForm;
