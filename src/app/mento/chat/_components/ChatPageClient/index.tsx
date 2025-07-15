"use client";

import { useState } from "react";

import { IconSolidConnentionLogo } from "@/public/svgs/mentor";

const getChatListData = () => {
  // 가상의 데이터 반환
  return [
    { id: 1, mentorName: "멘토1", lastMessage: "안녕하세요!" },
    { id: 2, mentorName: "멘토2", lastMessage: "멘토링 준비 되셨나요?" },
  ];
};

const ChatPageClient = () => {
  const chatList = getChatListData(); // 가상의 함수로 채팅 데이터를 가져온다고 가정

  if (chatList.length === 0) {
    return (
      <div>
        <IconSolidConnentionLogo />
        <p>현재 매칭된 멘토가 없어요.</p>
        <button>학교 찾으러 가볼까요?</button>
      </div>
    );
  }

  return (
    <div>
      <div className="go-find-mentor">멘토를 찾으러 가볼까요?</div>
      <ul>
        {chatList.map((chat) => (
          <li key={chat.id}>
            {chat.mentorName}: {chat.lastMessage}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatPageClient;
