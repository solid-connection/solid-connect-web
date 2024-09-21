import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import { updatePostApi } from "@/services/community";

import ArrowBackFilled from "@/components/ui/icon/ArrowBackFilled";

import { IconImage, IconPosstCheckboxOutlined, IconPostCheckboxFilled } from "@/public/svgs";

type PostModifyFormProps = {
  boardCode: string;
  postId: number;
  defaultTitle: string;
  defaultContent: string;
  defaultIsQuestion: boolean;
  defaultPostCategory: string;
};

export default function PostModifyForm({
  boardCode,
  postId,
  defaultTitle,
  defaultContent,
  defaultIsQuestion,
  defaultPostCategory,
}: PostModifyFormProps) {
  const [title, setTitle] = useState<string>(defaultTitle);
  const [content, setContent] = useState<string>(defaultContent);
  const textareaRef = useRef(null);
  const titleRef = useRef(null);
  const imageUploadRef = useRef(null);
  const router = useRouter();

  const routeBack = () => {
    router.back(); // 라우터의 back 함수를 사용하여 이전 페이지로 이동
  };

  useEffect(() => {
    const textarea = textareaRef.current;

    const adjustHeight = () => {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      const newHeight = scrollHeight <= 50 ? 50 : Math.min(scrollHeight, 100);
      textarea.style.height = `${newHeight}px`;
      titleRef.current.style.height = `${newHeight}px`;
    };

    textarea.addEventListener("input", adjustHeight);

    // 초기 높이 설정
    adjustHeight();

    return () => textarea.removeEventListener("input", adjustHeight);
  }, []);

  const submitPost = async () => {
    try {
      const res = await updatePostApi(boardCode, postId, {
        postUpdateRequest: {
          postCategory: defaultPostCategory,
          title: title,
          content: content,
        },
        file: [...imageUploadRef.current.files],
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
          className="transition-height border-b-gray-c-100 after:bg-gray-c-100 relative border-b duration-200 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px]"
          ref={titleRef}
        >
          <textarea
            className="transition-height text-black w-full resize-none overflow-hidden px-5 pb-2.5 pt-5 font-serif text-lg font-semibold leading-[160%] outline-none duration-200 placeholder:text-[rgba(124,124,124,0.87)]"
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
          ></textarea>
        </div>
        <div className="border-b-gray-c-100 flex h-[42px] items-center justify-between border-b px-5 py-2.5">
          <div className="flex items-center gap-1 font-serif text-sm font-normal leading-[160%] text-[rgba(124,124,124,0.87)]">
            <button role="button">
              {defaultIsQuestion ? <IconPostCheckboxFilled /> : <IconPosstCheckboxOutlined />}
            </button>
            질문으로 업로드 하기
          </div>
          <div>
            <button
              role="button"
              onClick={() => {
                imageUploadRef.current.click();
              }}
            >
              <IconImage />
            </button>
            <input className="hidden" ref={imageUploadRef} type="file" accept="image/*" multiple />
          </div>
        </div>
        <div>
          <textarea
            className="text-black h-90 mt-4 box-border w-full resize-none border-0 px-5 font-serif text-base font-normal leading-[160%] outline-none placeholder:text-[rgba(124,124,124,0.87)]"
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div
          className="px-5 pt-2.5 font-['Inter'] text-xs font-normal leading-[160%] text-[#8d8d8d]"
          dangerouslySetInnerHTML={{ __html: notice.replace(/\n/g, "<br />") }}
        ></div>
      </div>
    </>
  );
}

function CustomTopDetailNavigation({ routeBack, submitPost }) {
  return (
    <div className="fixed top-0 z-[100] box-border flex h-14 w-full max-w-[600px] items-center justify-between bg-white px-5">
      <div className="min-w-6 cursor-pointer" onClick={routeBack}>
        <ArrowBackFilled />
      </div>
      <div className="font-serif text-base font-semibold leading-[160%] text-[rgba(0,0,0,0.87)]">글쓰기</div>
      <div className="min-w-6 cursor-pointer">
        <button
          className="h-8 cursor-pointer rounded-full border-0 bg-primary-1 px-3 py-[5px] font-serif text-sm font-medium leading-[160%] text-white"
          onClick={submitPost}
        >
          등록
        </button>
      </div>
    </div>
  );
}
