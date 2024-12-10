"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { updatePostApi } from "@/services/community";

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
    try {
      await updatePostApi(boardCode, postId, {
        postUpdateRequest: {
          postCategory: defaultPostCategory,
          title,
          content,
        },
        file: imageUploadRef.current && imageUploadRef.current.files ? Array.from(imageUploadRef.current.files) : [],
      });
      router.push(`/community/${boardCode}/${postId}`);
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
        alert(err.message);
      }
    }
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
            className="w-full resize-none overflow-hidden px-5 pb-2.5 pt-5 font-serif text-lg font-semibold leading-[160%] text-black outline-none transition-height duration-200 placeholder:text-[rgba(124,124,124,0.87)]"
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
          <div className="flex items-center gap-1 font-serif text-sm font-normal leading-[160%] text-[rgba(124,124,124,0.87)]">
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
            className="mt-4 box-border h-90 w-full resize-none border-0 px-5 font-serif text-base font-normal leading-[160%] text-black outline-none placeholder:text-[rgba(124,124,124,0.87)]"
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div
          className="px-5 pt-2.5 font-['Inter'] text-xs font-normal leading-[160%] text-[#8d8d8d]"
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
  <div className="fixed top-0 z-30 box-border flex h-14 w-full max-w-[600px] items-center justify-between bg-white px-5">
    <button className="min-w-6 cursor-pointer" onClick={routeBack} type="button" aria-label="뒤로 가기">
      <IconArrowBackFilled />
    </button>
    <div className="font-serif text-base font-semibold leading-[160%] text-[rgba(0,0,0,0.87)]">글 수정</div>
    <div className="min-w-6 cursor-pointer">
      <button
        className="h-8 cursor-pointer rounded-full border-0 bg-secondary px-3 py-[5px] font-serif text-sm font-medium leading-[160%] text-white"
        onClick={submitPost}
        type="button"
      >
        등록
      </button>
    </div>
  </div>
);
