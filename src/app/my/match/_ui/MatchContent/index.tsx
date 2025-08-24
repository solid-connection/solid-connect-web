"use client";

import MentorCard from "@/components/mentor/MentorCard";
import MentorChatCard from "@/components/mentor/MentorChatCard";

import { UserRole } from "@/types/mentor";

import useGetChatRooms from "@/api/chat/clients/useGetChatRooms";
import useGetMyInfo from "@/api/my/client/useGetMyInfo";

const MatchContent = () => {
  const { data: myInfo = {} } = useGetMyInfo();
  const { data: chatRoom = [] } = useGetChatRooms();
  const isMnentor = myInfo.role === UserRole.MENTOR;

  const { nickname } = myInfo;

  return (
    <div className="flex h-full flex-col px-5">
      <p className="font-pretendard text-xl font-semibold text-k-700">
        {nickname ? `${nickname}님의` : "회원님이"}
        <br />
        매칭된 {isMnentor ? "멘토" : "멘티"}
      </p>
      {chatRoom.length === 0 ? (
        <p className="mt-6 text-center text-sm text-k-500">
          매칭된 {myInfo.role === UserRole.MENTEE ? "멘토" : "멘티"}가 없습니다.
        </p>
      ) : (
        <div className="mt-6 flex flex-1 flex-col gap-4 pb-4">
          {chatRoom.map((room) =>
            isMnentor ? (
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
