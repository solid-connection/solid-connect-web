"use client";

import { useGetChatRooms } from "@/apis/chat";
import { type MyInfoResponse, useGetMyInfo } from "@/apis/MyPage";
import MentorCard from "@/components/mentor/MentorCard";
import MentorChatCard from "@/components/mentor/MentorChatCard";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { UserRole } from "@/types/mentor";

const MatchContent = () => {
  const { data: myInfo = {} as MyInfoResponse } = useGetMyInfo();
  const { data: chatRoom = [] } = useGetChatRooms();
  const clientRole = useAuthStore((state) => state.clientRole);

  const isMentor = myInfo.role === UserRole.MENTOR || myInfo.role === UserRole.ADMIN;
  const viewAsMentor = clientRole ? clientRole === UserRole.MENTOR : isMentor;

  const { nickname } = myInfo;

  return (
    <div className="flex h-full flex-col px-5">
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
