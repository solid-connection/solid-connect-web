"use client";

import ProfileWithBadge from "@/components/ui/ProfileWithBadge";

import { IconSearchBlue, IconSolidConnentionLogo } from "@/public/svgs/mentor";

const getChatListData = () => {
  // 가상의 데이터 반환
  return [
    {
      id: 1,
      mentorName: "정솔커",
      lastMessage: "안녕하세요! 교환학생에 대해 무엇이든 물어보세요...",
      profileImageUrl: "/images/profile1.jpg",
      unReadCount: 3,
    },
    {
      id: 2,
      mentorName: "윤솔커",
      lastMessage: "안녕하세요! 교환학생에 대해 무엇이든 물어보세요...",
      profileImageUrl: "/images/profile2.jpg",
      unReadCount: 9,
    },
    {
      id: 3,
      mentorName: "정솔커",
      lastMessage: "안녕하세요! 교환학생에 대해 무엇이든 물어보세요...",
      profileImageUrl: "/images/profile3.jpg",
      unReadCount: 15,
    },
    {
      id: 4,
      mentorName: "윤솔커",
      lastMessage: "안녕하세요! 교환학생에 대해 무엇이든 물어보세요...",
      profileImageUrl: "",
      unReadCount: 0,
    },
    {
      id: 5,
      mentorName: "박솔커",
      lastMessage: "안녕하세요! 교환학생에 대해 무엇이든 물어보세요...",
      profileImageUrl: "/images/profile5.jpg",
      unReadCount: 0,
    },
    {
      id: 6,
      mentorName: "윤솔커",
      lastMessage: "안녕하세요! 교환학생에 대해 무엇이든 물어보세요...",
      profileImageUrl: "/images/profile6.jpg",
      unReadCount: 0,
    },
  ];
};

const ChatPageClient = () => {
  const chatList = getChatListData(); // 가상의 함수로 채팅 데이터를 가져온다고 가정

  if (chatList.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="w-15 h-[45px]">
          <IconSolidConnentionLogo />
        </div>
        <p className="text-center font-medium text-k-300">
          현재 매칭된 멘토가 없어요.
          <br />
          멘토부터 찾아볼까요?
        </p>
        <button className="mt-5 flex h-[52px] w-60 items-center justify-center gap-[10px] rounded-[30px] bg-[linear-gradient(270deg,_var(--Primary-Color,_#5950F6)_0%,_var(--SubA-Color,_#388CE8)_100%)] px-[10px] font-semibold text-white">
          학교 찾으러 가볼까요?
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      {/* 헤더 */}
      <div className="flex h-[66px] w-full items-center justify-between bg-secondary-100 px-9 py-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-5 w-5">
              <IconSearchBlue />
            </span>
            <span className="font-semibold text-secondary">멘토를 찾으러 가볼까요?</span>
          </div>
          <p className="w-[140px] text-end text-[13px] font-medium text-k-600">나의 멘토 찾으러가기</p>
        </div>
        <div className="text-blue-600">
          <span>›</span>
        </div>
      </div>

      {/* 나의 멘토 섹션 */}
      <div className="px-5 py-4">
        <div className="mb-4 flex items-center gap-[10px]">
          <h2 className="text-lg font-semibold text-gray-900">나의 멘토</h2>
          <span className="rounded-full bg-primary px-2 py-1 text-xs text-white">9+</span>
        </div>

        {/* 채팅 리스트 */}
        <button className="w-full space-y-3">
          {chatList.map((chat) => (
            <div key={chat.id} className="flex items-center gap-3 border-b border-k-50 py-2">
              {/* 프로필 이미지 */}
              <ProfileWithBadge profileImageUrl={chat.profileImageUrl} width={48} height={48} />

              {/* 채팅 내용 */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="truncate font-semibold text-k-900">{chat.mentorName}</h3>
                  {/* 읽지 않은 메시지 배지 */}
                  {chat.unReadCount > 0 && (
                    <span className="ml-2 rounded-full bg-primary px-2 py-1 text-xs text-white">
                      {chat.unReadCount > 9 ? "9+" : chat.unReadCount}
                    </span>
                  )}
                </div>
                <p className="mt-1 truncate text-sm text-k-600">{chat.lastMessage}</p>
              </div>
            </div>
          ))}
        </button>
      </div>
    </div>
  );
};

export default ChatPageClient;
