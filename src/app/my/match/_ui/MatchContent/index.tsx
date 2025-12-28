"use client";

import { useState } from "react";

import MentorCard from "@/components/mentor/MentorCard";
import MentorChatCard from "@/components/mentor/MentorChatCard";

import { UserRole } from "@/types/mentor";

import { MyInfoResponse, useGetMyInfo } from "@/apis/MyPage";
import { useGetChatRooms } from "@/apis/chat";

const MatchContent = () => {
  const { data: myInfo = {} as MyInfoResponse } = useGetMyInfo();
  const { data: chatRoom = [] } = useGetChatRooms();

  const isAdmin = myInfo.role === UserRole.ADMIN;
  const isMentor = myInfo.role === UserRole.MENTOR || myInfo.role === UserRole.ADMIN;

  // 어드민 전용: 뷰 전환 상태 (true: 멘토 뷰, false: 멘티 뷰)
  const [showMentorView, setShowMentorView] = useState<boolean>(true);

  // 어드민이 아닌 경우 기존 로직대로, 어드민인 경우 토글 상태에 따라
  const viewAsMentor = isAdmin ? showMentorView : isMentor;

  const { nickname } = myInfo;

  return (
    <div className="flex h-full flex-col px-5">
      {/* 어드민 전용 뷰 전환 버튼 */}
      {isAdmin && (
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setShowMentorView(true)}
            className={`flex-1 rounded-lg px-4 py-2.5 transition-colors typo-sb-9 ${
              showMentorView ? "bg-primary text-white" : "border border-k-200 bg-white text-k-600 hover:bg-k-50"
            }`}
          >
            멘토 뷰
          </button>
          <button
            onClick={() => setShowMentorView(false)}
            className={`flex-1 rounded-lg px-4 py-2.5 transition-colors typo-sb-9 ${
              !showMentorView ? "bg-primary text-white" : "border border-k-200 bg-white text-k-600 hover:bg-k-50"
            }`}
          >
            멘티 뷰
          </button>
        </div>
      )}

      <p className="font-pretendard text-k-700 typo-sb-4">
        {nickname ? `${nickname}님의` : "회원님이"}
        <br />
        매칭된 {viewAsMentor ? "멘티" : "멘토"}
      </p>
      {chatRoom.length === 0 ? (
        <p className="mt-6 text-center text-k-500 typo-regular-2">
          매칭된 {viewAsMentor ? "멘티" : "멘토"}가 없습니다.
        </p>
      ) : (
        <div className="mt-6 flex flex-1 flex-col gap-4 pb-4">
          {chatRoom.map((room) =>
            viewAsMentor ? (
              <MentorChatCard
                key={room.id}
                profileImageUrl={room.partner.profileUrl}
                nickname={room.partner.nickname}
                description={room.lastChatMessage || "안녕하세요! 교환학생에 대해 무엇이든 물어보세요!"}
                time={room.lastReceivedTime}
              />
            ) : (
              // TO DO 멘토 가져오기 API 구현시
              <MentorCard
                key={room.id}
                mentor={{
                  id: room.id,
                  profileImageUrl: room.partner.profileUrl ?? null,
                  nickname: room.partner.nickname ?? "",
                  country: "",
                  universityName: room.partner.university ?? "",
                  menteeCount: 0,
                  hasBadge: false,
                  introduction: "",
                  channels: [],
                  term: "",
                }}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
};
export default MatchContent;
