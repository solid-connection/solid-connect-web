"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import ProfileWithBadge from "@/components/ui/ProfileWithBadge";

import ChatMessageBox from "./_components/ChatMessageBox";

import { ChatMessage } from "@/types/mentor";

import { IconCamera, IconDirectMessage } from "@/public/svgs/mentor";

interface MessageForm {
  message: string;
}

// 더미 채팅 데이터
const messages: ChatMessage[] = [
  {
    id: 1,
    sender: "other",
    senderName: "김멘토",
    message: "안녕하세요!\n질문이 있어서 연락드렸습니다!",
    time: new Date("2025-06-12T12:02:00"),
  },
  {
    id: 2,
    sender: "me",
    senderName: "나",
    message: "안녕하세요!\n질문이 있어서 연락드렸습니다!",
    time: new Date("2025-06-12T12:06:00"),
  },
  {
    id: 3,
    sender: "other",
    senderName: "김멘토",
    message: "안녕하세요!\n질문이 있어서 연락드렸습니다!",
    time: new Date("2025-06-13T12:07:00"),
  },
];

const formatDateSeparator = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const dayName = dayNames[date.getDay()];
  return `${year}. ${month}. ${day} ${dayName}`;
};

const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const ChatContent = () => {
  const { register, handleSubmit, reset, watch } = useForm<MessageForm>();
  const [submittedMessages, setSubmittedMessages] = useState<ChatMessage[]>(messages);

  // 방해금지시간
  const isDistributeTime = false; // 예시로 false로 설정, 실제 로직에 맞게 변경 필요

  const onSubmit = (data: MessageForm) => {
    if (data.message.trim()) {
      const newMessage: ChatMessage = {
        id: submittedMessages.length + 1,
        sender: "me",
        senderName: "나",
        message: data.message,
        time: new Date(),
      };
      setSubmittedMessages([...submittedMessages, newMessage]);
      reset();
    }
  };

  const messageValue = watch("message", "");

  return (
    <div className="relative flex h-[calc(100vh-112px)] flex-col">
      <div className="flex h-full flex-col px-5">
        {/* Floating 멘토 정보 영역 */}
        <div className="z-10 mt-5 h-16 w-full">
          <div className="flex w-full items-center justify-between rounded bg-primary-100 px-2.5 py-2">
            <div className="flex items-center gap-2">
              <ProfileWithBadge width={24} height={24} />
              <div className="flex h-full items-center">
                <span className="text-base font-semibold text-k-700">김솔커 멘토</span>
                <div className="mx-4 h-10 w-[1px] bg-k-100"></div>
                <div className="flex text-sm font-medium text-primary">
                  스웨덴 <br /> 대학교 컴퓨터공학과
                </div>
              </div>
            </div>
            <button className="rounded-3xl bg-primary px-4 py-2 text-sm font-semibold text-k-0">멘토 페이지</button>
          </div>
          <div className="rounded bg-white px-4 py-2">
            <p className="bg-gradient-to-r from-primary to-sub-a bg-clip-text text-center text-sm font-semibold text-transparent">
              멘토링이 연결되었습니다! 채팅을 시작해보세요!
            </p>
          </div>
        </div>

        {/* 채팅 메시지 영역 */}
        <div className="flex-1 overflow-y-auto p-4 pb-0">
          <div className="space-y-4">
            {submittedMessages.map((message, index) => {
              const showDateSeparator = index === 0 || !isSameDay(submittedMessages[index - 1].time, message.time);

              return (
                <div key={message.id}>
                  {/* 날짜 구분선 */}
                  {showDateSeparator && (
                    <div className="my-4 mb-6 flex w-full justify-center">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                        {formatDateSeparator(message.time)}
                      </span>
                    </div>
                  )}
                  {/* 일반 채팅 메시지 */}
                  <ChatMessageBox key={message.id} message={message} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 메시지 입력 영역 - 하단 고정 */}
      <div className="shadow-top w-full border-b border-t border-k-50 bg-k-0">
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2 p-4">
          <button className="h-[18px] w-5">
            <IconCamera />
          </button>
          <div className="flex flex-1 justify-between rounded-2xl bg-k-50">
            <input
              type="text"
              className="flex-1 bg-transparent pl-3 text-[14px] text-k-800 outline-none placeholder:text-k-500"
              {...register("message", { required: true })}
              placeholder={isDistributeTime ? "지금은 방해 금지 시간이에요. (00:00~08:00)" : "메시지를 입력하세요..."}
              disabled={isDistributeTime}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(onSubmit)();
                }
              }}
            />
            <button
              type="submit"
              disabled={!messageValue.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary disabled:bg-k-100"
            >
              <IconDirectMessage />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatContent;
