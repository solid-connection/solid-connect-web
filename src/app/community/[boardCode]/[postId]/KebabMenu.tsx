"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import ReportPanel from "@/components/ui/ReportPanel";

import { useDeletePost } from "@/apis/community";
import { toast } from "@/lib/zustand/useToastStore";
import { IconSetting } from "@/public/svgs/mentor";

const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

// 외부 클릭 감지 훅 (가정)

const IconLink = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none">
    <path
      d="M9 2.63333V12.2667M12.2143 4.9L9 1.5L5.78571 4.9M1.5 10.5667V16.2333C1.5 16.8345 1.72576 17.411 2.12763 17.8361C2.52949 18.2612 3.07454 18.5 3.64286 18.5H14.3571C14.9255 18.5 15.4705 18.2612 15.8724 17.8361C16.2742 17.411 16.5 16.8345 16.5 16.2333V10.5667"
      stroke="currentColor"
      className="text-sub-d-500"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

// --- 메인 컴포넌트 ---
type KebabMenuProps = {
  postId: number;
  boardCode: string;
  isOwner?: boolean;
};

const KebabMenu = ({ postId, boardCode, isOwner = false }: KebabMenuProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { mutate: deletePost } = useDeletePost();
  const router = useRouter();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 외부 영역 클릭 시 드롭다운 닫기
  useClickOutside(dropdownRef, () => {
    setIsDropdownOpen(false);
  });

  // URL 복사 로직
  const handleCopyUrl = async () => {
    setIsDropdownOpen(false);
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast.success("URL이 복사되었습니다.");
    } catch (err) {
      console.error("Failed to copy URL:", err);
      toast.error("URL 복사에 실패했습니다.");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        type="button"
        aria-label="더보기"
        className="flex h-6 w-6 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
      >
        <IconSetting />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 top-full z-10 mt-2 w-40 origin-top-right rounded-lg border border-gray-100 bg-white shadow-lg">
          <ul className="p-1">
            <li>
              <ReportPanel idx={postId} />
            </li>
            <li key={"URL 복사"}>
              <button
                onClick={handleCopyUrl}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-gray-700 typo-regular-2 hover:bg-gray-50`}
              >
                <span className="flex-shrink-0">
                  <IconLink />
                </span>
                <span>{"URL 복사"}</span>
              </button>
            </li>
            {isOwner && (
              <>
                <li key={"수정하기"}>
                  <button
                    onClick={() => {
                      router.push(`/community/${boardCode}/${postId}/modify`);
                    }}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-gray-700 typo-regular-2 hover:bg-gray-50`}
                  >
                    <span>{"수정하기"}</span>
                  </button>
                </li>
                <li key={"삭제하기"}>
                  <button
                    onClick={() => {
                      if (confirm("정말로 삭제하시겠습니까?")) {
                        deletePost(postId);
                      }
                    }}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-gray-700 typo-regular-2 hover:bg-gray-50`}
                  >
                    <span>{"삭제하기"}</span>
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default KebabMenu;
