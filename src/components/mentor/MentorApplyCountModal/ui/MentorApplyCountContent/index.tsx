"use client";

import { useState } from "react";

const MentorApplyCountContent = ({ count }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

  if (!isModalOpen) return null; // 모달이 열려있지 않으면 표시 X
  return (
    <div className="relative w-full max-w-md rounded-xl bg-blue-500 px-6 py-4 text-white shadow-md">
      {/* close button */}
      <button
        type="button"
        onClick={() => setIsModalOpen(false)}
        className="absolute right-3 top-3 text-white/80 hover:text-white"
        aria-label="닫기"
      >
        ✕
      </button>

      <div className="flex items-center">
        {/* left: message */}
        <div className="flex-1">
          <h2 className="text-xs font-semibold">알림</h2>
          <p className="mt-1 text-sm leading-snug">새로운 요청이 들어왔어요!</p>
          <p className="text-sm leading-snug">어서 요청을 수락해주세요.</p>
        </div>

        {/* divider */}
        <div className="mx-4 h-12 w-px bg-white/40" />

        {/* right: count */}
        <div className="min-w-[80px] text-center">
          <span className="text-xs">신규 신청</span>
          <div className="text-2xl font-bold">{count}명</div>
        </div>
      </div>
    </div>
  );
};

export default MentorApplyCountContent;
