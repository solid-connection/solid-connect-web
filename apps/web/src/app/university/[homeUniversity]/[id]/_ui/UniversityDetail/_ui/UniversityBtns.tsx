"use client";

import { useEffect, useState } from "react";

import { useDeleteWish, useGetWishList, usePostAddWish } from "@/apis/universities";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { toast } from "@/lib/zustand/useToastStore";

const likeIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="16" viewBox="0 0 19 16" fill="none">
    <path
      d="M13.3562 0C11.7398 0 10.3052 0.634385 9.33325 1.72476C8.3613 0.634385 6.9267 0 5.31026 0C3.9024 0.00169364 2.55268 0.558508 1.55717 1.54831C0.561652 2.53811 0.0016233 3.88008 -8.01086e-05 5.27987C-8.01086e-05 11.0669 8.51337 15.6908 8.87544 15.8852C9.01614 15.9606 9.17345 16 9.33325 16C9.49306 16 9.65037 15.9606 9.79107 15.8852C10.1531 15.6908 18.6666 11.0669 18.6666 5.27987C18.6649 3.88008 18.1049 2.53811 17.1093 1.54831C16.1138 0.558508 14.7641 0.00169364 13.3562 0ZM12.9145 11.3885C11.7939 12.334 10.596 13.1849 9.33325 13.9325C8.07048 13.1849 6.87258 12.334 5.75199 11.3885C4.00843 9.90136 1.93095 7.63342 1.93095 5.27987C1.93095 4.38877 2.28699 3.53416 2.92073 2.90405C3.55447 2.27394 4.41402 1.91995 5.31026 1.91995C6.74245 1.91995 7.9413 2.67194 8.43935 3.88311C8.51184 4.05967 8.63557 4.21076 8.79478 4.31712C8.95399 4.42348 9.14145 4.48028 9.33325 4.48028C9.52506 4.48028 9.71252 4.42348 9.87173 4.31712C10.0309 4.21076 10.1547 4.05967 10.2272 3.88311C10.7252 2.67194 11.9241 1.91995 13.3562 1.91995C14.2525 1.91995 15.112 2.27394 15.7458 2.90405C16.3795 3.53416 16.7356 4.38877 16.7356 5.27987C16.7356 7.63342 14.6581 9.90136 12.9145 11.3885Z"
      fill="#4672EE"
    />
  </svg>
);

// 채워진 하트
const likeIconFilled = (
  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="16" viewBox="0 0 19 16" fill="none">
    <path
      d="M13.3562 0C11.7398 0 10.3052 0.634385 9.33325 1.72476C8.3613 0.634385 6.9267 0 5.31026 0C3.9024 0.00169364 2.55268 0.558508 1.55717 1.54831C0.561652 2.53811 0.0016233 3.88008 -8.01086e-05 5.27987C-8.01086e-05 11.0669 8.51337 15.6908 8.87544 15.8852C9.01614 15.9606 9.17345 16 9.33325 16C9.49306 16 9.65037 15.9606 9.79107 15.8852C10.1531 15.6908 18.6666 11.0669 18.6666 5.27987C18.6649 3.88008 18.1049 2.53811 17.1093 1.54831C16.1138 0.558508 14.7641 0.00169364 13.3562 0Z"
      fill="#4672EE"
    />
  </svg>
);

const copyIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="19" viewBox="0 0 17 19" fill="none">
    <path
      d="M8.5 2.13333V11.7667M11.7143 4.4L8.5 1L5.28571 4.4M1 10.0667V15.7333C1 16.3345 1.22576 16.911 1.62763 17.3361C2.02949 17.7612 2.57454 18 3.14286 18H13.8571C14.4255 18 14.9705 17.7612 15.3724 17.3361C15.7742 16.911 16 16.3345 16 15.7333V10.0667"
      stroke="#4672EE"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

interface UniversityBtnsProps {
  universityId: number;
}
const UniversityBtns = ({ universityId }: UniversityBtnsProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [isLiked, setIsLiked] = useState(false);
  const { data: favoriteUniv } = useGetWishList(isAuthenticated);
  const { mutate: postUniversityFavorite } = usePostAddWish();
  const { mutate: deleteUniversityFavorite } = useDeleteWish();

  useEffect(() => {
    favoriteUniv?.forEach((univ) => {
      if (univ.id === universityId) {
        setIsLiked(true);
      }
    });
  }, [favoriteUniv, universityId]);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLiked(false);
    }
  }, [isAuthenticated]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {});
    toast.success("URL이 복사되었습니다.");
  };
  return (
    <>
      <button
        onClick={() => {
          if (!isAuthenticated) {
            toast.error("로그인 후 이용 가능합니다.");
            return;
          }
          if (isLiked) {
            deleteUniversityFavorite(universityId);
            setIsLiked(false);
          } else {
            postUniversityFavorite(universityId);
            setIsLiked(true);
          }
        }}
        className={`/* stroke: #FFF; stroke-width: 1px; */ /* fill: linear-gradient(...) */ /* CSS의 fill은 SVG 속성이지만, 버튼 배경으로 적용합니다. */ /* backdrop-filter: blur(2px); */ /* filter: drop-shadow(...) */ /* 기타 스타일 */ rounded-full border border-white/80 bg-[linear-gradient(136deg,rgba(255,255,255,0.4)_14.87%,rgba(199,212,250,0.8)_89.1%)] p-3 drop-shadow-[2px_2px_6px_#C7D4FA] backdrop-blur-[2px] transition-transform duration-200 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 active:scale-95`}
      >
        {isLiked ? likeIconFilled : likeIcon}
      </button>
      <button
        onClick={handleCopy}
        className={`/* stroke: #FFF; stroke-width: 1px; */ /* fill: linear-gradient(...) */ /* CSS의 fill은 SVG 속성이지만, 버튼 배경으로 적용합니다. */ /* backdrop-filter: blur(2px); */ /* filter: drop-shadow(...) */ /* 기타 스타일 */ rounded-full border border-white/80 bg-[linear-gradient(136deg,rgba(255,255,255,0.4)_14.87%,rgba(199,212,250,0.8)_89.1%)] p-3 drop-shadow-[2px_2px_6px_#C7D4FA] backdrop-blur-[2px] transition-transform duration-200 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 active:scale-95`}
      >
        {copyIcon}
      </button>
    </>
  );
};

export default UniversityBtns;
