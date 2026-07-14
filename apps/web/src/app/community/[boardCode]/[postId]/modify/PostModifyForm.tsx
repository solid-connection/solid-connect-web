"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  type Dispatch,
  type DragEvent,
  type RefObject,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useUpdatePost } from "@/apis/community";
import PostCategorySelector from "@/app/community/_components/PostCategorySelector";
import useCommunityImageUpload from "@/app/community/_hooks/useCommunityImageUpload";
import { showIconToast } from "@/lib/toast/showIconToast";
import { IconArrowBackFilled, IconImage } from "@/public/svgs";
import useIsDesktopViewport from "@/utils/useIsDesktopViewport";

type PostModifyFormProps = {
  boardCode: string;
  postId: number;
  defaultTitle: string;
  defaultContent: string;
  defaultIsQuestion: boolean;
  defaultPostCategory: string;
};

type PostModifyEditorProps = {
  titleRef: RefObject<HTMLDivElement | null>;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
  postCategory: string;
  setPostCategory: Dispatch<SetStateAction<string>>;
  maxImages: number;
  imageUploadRef: RefObject<HTMLInputElement | null>;
  selectedImages: File[];
  imagePreviewUrls: string[];
  isDraggingImage: boolean;
  handleImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleImageDragEnter: (event: DragEvent<HTMLDivElement>) => void;
  handleImageDragOver: (event: DragEvent<HTMLDivElement>) => void;
  handleImageDragLeave: (event: DragEvent<HTMLDivElement>) => void;
  handleImageDrop: (event: DragEvent<HTMLDivElement>) => void;
  removeSelectedImage: (index: number) => void;
  openImagePicker: () => void;
};

type PostModifyFormViewProps = PostModifyEditorProps & {
  routeBack: () => void;
  submitPost: () => void;
};

const NOTICE_TITLE = "[글 작성 시 유의사항]";
const NOTICE_CONTENT =
  "인종, 성별, 출신, 지역, 이념 관련 차별 관련 발언 및 타인에게 불쾌감을 유발할 수 있는 글은 삭제될 수 있습니다.\n\n솔리드 커넥션은 홍보 행위를 철저히 금지합니다.";

const PostModifyForm = ({
  boardCode,
  postId,
  defaultTitle,
  defaultContent,
  defaultIsQuestion,
  defaultPostCategory,
}: PostModifyFormProps) => {
  const [title, setTitle] = useState<string>(defaultTitle);
  const [content, setContent] = useState<string>(defaultContent);
  const [postCategory, setPostCategory] = useState<string>(
    defaultPostCategory || (defaultIsQuestion ? "질문" : "자유"),
  );
  const isDesktop = useIsDesktopViewport();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
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
  const router = useRouter();

  const updatePostMutation = useUpdatePost();

  const routeBack = () => {
    router.back();
  };

  useEffect(() => {
    if (isDesktop === null) {
      return () => {};
    }

    const textarea = textareaRef.current;
    const titleDiv = titleRef.current;

    if (textarea && titleDiv) {
      const adjustHeight = () => {
        textarea.style.height = "auto";
        const { scrollHeight } = textarea;
        const newHeight = scrollHeight <= 50 ? 50 : Math.min(scrollHeight, 100);
        textarea.style.height = `${newHeight}px`;
        titleDiv.style.height = `${newHeight}px`;
      };

      textarea.addEventListener("input", adjustHeight);

      // 초기 높이 설정
      adjustHeight();

      return () => textarea.removeEventListener("input", adjustHeight);
    }
    return () => {};
  }, [isDesktop]);

  const submitPost = async () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) {
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

    updatePostMutation.mutate(
      {
        postId,
        boardCode,
        data: {
          postUpdateRequest: {
            postCategory,
            title: trimmedTitle,
            content: trimmedContent,
          },
          file: selectedImages,
        },
      },
      {
        onSuccess: () => {
          router.push(`/community/${boardCode}/${postId}`);
        },
      },
    );
  };

  if (isDesktop === null) {
    return <div aria-hidden className="min-h-screen bg-white md:bg-k-50" />;
  }

  const editorProps: PostModifyEditorProps = {
    titleRef,
    textareaRef,
    title,
    setTitle,
    content,
    setContent,
    postCategory,
    setPostCategory,
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
  };

  if (isDesktop) {
    return <DesktopPostModifyFormView {...editorProps} routeBack={routeBack} submitPost={submitPost} />;
  }

  return <MobilePostModifyFormView {...editorProps} routeBack={routeBack} submitPost={submitPost} />;
};

export default PostModifyForm;

type PostModifyEditorBaseProps = PostModifyEditorProps & {
  isDesktop: boolean;
};

const PostModifyEditorBase = ({
  titleRef,
  textareaRef,
  title,
  setTitle,
  content,
  setContent,
  postCategory,
  setPostCategory,
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
  isDesktop,
}: PostModifyEditorBaseProps) => (
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
        value={title}
        onChange={(e) => setTitle(e.target.value)}
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
          type="button"
          onClick={() => {
            openImagePicker();
          }}
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
        <p className="text-gray-250/87 typo-sb-9">{NOTICE_TITLE}</p>
        <p className="mt-2 whitespace-pre-line text-gray-100 typo-regular-4">{NOTICE_CONTENT}</p>
      </div>
    )}
  </div>
);

const DesktopPostModifyEditor = (props: PostModifyEditorProps) => <PostModifyEditorBase {...props} isDesktop />;

const MobilePostModifyEditor = (props: PostModifyEditorProps) => <PostModifyEditorBase {...props} isDesktop={false} />;

const DesktopPostModifyFormView = (props: PostModifyFormViewProps) => {
  const { routeBack, submitPost, selectedImages, maxImages } = props;

  return (
    <div className="desktop-page-shell">
      <header className="mb-8 flex items-end justify-between gap-6">
        <div>
          <p className="text-primary typo-sb-9">Community</p>
          <h1 className="mt-2 text-k-900 typo-bold-1">글 수정</h1>
          <p className="mt-2 text-k-500 typo-medium-2">게시글 내용을 수정하고 이미지를 추가로 첨부하세요.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={routeBack}
            className="rounded-lg border border-k-100 bg-white px-4 py-3 text-k-700 transition-colors typo-sb-9 hover:border-primary hover:text-primary"
          >
            취소
          </button>
          <button
            className="rounded-lg bg-primary px-5 py-3 text-white transition-colors typo-sb-9 hover:bg-primary-700"
            onClick={submitPost}
            type="button"
          >
            등록
          </button>
        </div>
      </header>

      <div className="grid items-start gap-8 xl:grid-cols-[minmax(520px,760px)_minmax(280px,360px)]">
        <DesktopPostModifyEditor {...props} />
        <aside className="desktop-sticky-panel rounded-lg border border-k-100 bg-white p-6">
          <h2 className="text-k-900 typo-bold-4">{NOTICE_TITLE}</h2>
          <p className="mt-5 whitespace-pre-line text-k-600 typo-medium-3">{NOTICE_CONTENT}</p>
          <div className="mt-6 rounded-lg bg-k-50 p-4 text-k-500 typo-regular-2">
            새 첨부 이미지 {selectedImages.length}/{maxImages}
          </div>
        </aside>
      </div>
    </div>
  );
};

const MobilePostModifyFormView = ({ routeBack, submitPost, ...editorProps }: PostModifyFormViewProps) => (
  <>
    <MobilePostModifyNavigation routeBack={routeBack} submitPost={submitPost} />
    <MobilePostModifyEditor {...editorProps} />
  </>
);

type CustomTopDetailNavigationProps = {
  routeBack: () => void;
  submitPost: () => void;
};

const MobilePostModifyNavigation = ({ routeBack, submitPost }: CustomTopDetailNavigationProps) => (
  <div className="fixed top-0 z-30 box-border flex h-14 w-full max-w-app items-center justify-between bg-white px-5 md:hidden">
    <button className="min-w-6 cursor-pointer" onClick={routeBack} type="button" aria-label="뒤로 가기">
      <IconArrowBackFilled />
    </button>
    <div className="text-black/87 typo-sb-7">글 수정</div>
    <div className="min-w-6 cursor-pointer">
      <button
        className="h-8 cursor-pointer rounded-full border-0 bg-primary px-3 py-[5px] text-white typo-medium-2"
        onClick={submitPost}
        type="button"
      >
        등록
      </button>
    </div>
  </div>
);
