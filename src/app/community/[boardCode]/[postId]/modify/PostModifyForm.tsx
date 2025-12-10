"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import useUpdatePost from "@/api/community/client/useUpdatePost";
import { IconArrowBackFilled, IconImage, IconPostCheckboxFilled, IconPostCheckboxOutlined } from "@/public/svgs";

type PostModifyFormProps = {
  boardCode: string;
  postId: number;
  defaultTitle: string;
  defaultContent: string;
  defaultIsQuestion: boolean;
  defaultPostCategory: string;
};

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const imageUploadRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const updatePostMutation = useUpdatePost();

  const routeBack = () => {
    router.back();
  };

  useEffect(() => {
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
  }, []);

  const submitPost = async () => {
    updatePostMutation.mutate(
      {
        postId,
        data: {
          postUpdateRequest: {
            postCategory: defaultPostCategory,
            title,
            content,
          },
          file: imageUploadRef.current && imageUploadRef.current.files ? Array.from(imageUploadRef.current.files) : [],
        },
      },
      {
        onSuccess: () => {
          router.push(`/community/${boardCode}/${postId}`);
        },
      },
    );
  };

  const notice =
    "글 작성 시 유의사항\n\n인종, 성별, 출신, 지역, 이념 관련 차별 관련 발언 및 타인에게 불쾌감을 유발할 수 있는 글은 삭제될 수 있습니다.\n\n솔리드 커넥션은 홍보 행위를 철저히 금지합니다.";

  return (
    <>
      <CustomTopDetailNavigation routeBack={routeBack} submitPost={submitPost} />
      <div>
        <div
          className="relative border-b border-b-gray-c-100 transition-height duration-200 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-gray-c-100"
          ref={titleRef}
        >
          <textarea
            className="w-full resize-none overflow-hidden px-5 pb-2.5 pt-5 typo-sb-4 text-black outline-none transition-height duration-200 placeholder:text-[rgba(124,124,124,0.87)]"
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
        <div className="flex h-[42px] items-center justify-between border-b border-b-gray-c-100 px-5 py-2.5">
          <div className="flex items-center gap-1 typo-regular-2 text-[rgba(124,124,124,0.87)]">
            <button type="button">
              {defaultIsQuestion ? <IconPostCheckboxFilled /> : <IconPostCheckboxOutlined />}
            </button>
            질문으로 업로드 하기
          </div>
          <div>
            <button
              type="button"
              onClick={() => {
                imageUploadRef.current?.click();
              }}
              aria-label="이미지 추가"
            >
              <IconImage />
            </button>
            <input className="hidden" ref={imageUploadRef} type="file" accept="image/*" multiple />
          </div>
        </div>
        <div>
          <textarea
            className="mt-4 box-border h-90 w-full resize-none border-0 px-5 typo-regular-1 text-black outline-none placeholder:text-[rgba(124,124,124,0.87)]"
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div
          className="px-5 pt-2.5 typo-regular-4 text-[#8d8d8d]"
          dangerouslySetInnerHTML={{ __html: notice.replace(/\n/g, "<br />") }}
        />
      </div>
    </>
  );
};

export default PostModifyForm;

type CustomTopDetailNavigationProps = {
  routeBack: () => void;
  submitPost: () => void;
};

const CustomTopDetailNavigation = ({ routeBack, submitPost }: CustomTopDetailNavigationProps) => (
  <div className="max-w-app fixed top-0 z-30 box-border flex h-14 w-full items-center justify-between bg-white px-5">
    <button className="min-w-6 cursor-pointer" onClick={routeBack} type="button" aria-label="뒤로 가기">
      <IconArrowBackFilled />
    </button>
    <div className="typo-sb-7 text-[rgba(0,0,0,0.87)]">글 수정</div>
    <div className="min-w-6 cursor-pointer">
      <button
        className="h-8 cursor-pointer rounded-full border-0 bg-primary px-3 py-[5px] typo-medium-2 text-white"
        onClick={submitPost}
        type="button"
      >
        등록
      </button>
    </div>
  </div>
);
