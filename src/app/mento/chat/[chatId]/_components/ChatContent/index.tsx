"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import ProfileWithBadge from "@/components/ui/ProfileWithBadge";

interface Message {
  id: number;
  sender: "me" | "other";
  senderName: string;
  message: string;
  time: Date;
}

interface MessageForm {
  message: string;
}

// 더미 채팅 데이터
const messages: Message[] = [
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

// 날짜 포맷팅 함수
const formatTime = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "오후" : "오전";
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${period} ${displayHours}:${minutes.toString().padStart(2, "0")}`;
};

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
  const [submittedMessages, setSubmittedMessages] = useState<Message[]>(messages);

  const onSubmit = (data: MessageForm) => {
    if (data.message.trim()) {
      const newMessage: Message = {
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
    <div className="relative flex h-[calc(100vh-112px)] flex-col px-5">
      {/* Floating 멘토 정보 영역 */}
      <div className="z-10 mt-5 flex h-16 w-full items-center rounded bg-primary-100 px-2.5 py-2">
        <div className="flex w-full items-center justify-between">
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
      </div>

      {/* 채팅 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 pb-0 pt-28">
        <div className="space-y-4">
          {submittedMessages.map((msg, index) => {
            const showDateSeparator = index === 0 || !isSameDay(submittedMessages[index - 1].time, msg.time);

            return (
              <div key={msg.id}>
                {/* 날짜 구분선 */}
                {showDateSeparator && (
                  <div className="my-4 flex items-center">
                    <div className="flex-1 border-t border-gray-200"></div>
                    <div className="rounded-full bg-gray-100 px-4 py-2">
                      <span className="text-sm text-gray-600">{formatDateSeparator(msg.time)}</span>
                    </div>
                    <div className="flex-1 border-t border-gray-200"></div>
                  </div>
                )}

                {/* 일반 채팅 메시지 */}
                <div className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex max-w-xs gap-2 ${msg.sender === "me" ? "flex-row-reverse" : "flex-row"}`}>
                    {msg.sender !== "me" && <ProfileWithBadge width={32} height={32} />}

                    <div className={`flex flex-col ${msg.sender === "me" ? "items-end" : "items-start"}`}>
                      {msg.sender !== "me" && (
                        <span className="mb-1 text-xs font-medium text-k-900">{msg.senderName}</span>
                      )}

                      <div className="flex items-end gap-1">
                        {msg.sender === "me" && <span className="text-xs text-k-500">{formatTime(msg.time)}</span>}

                        <div
                          className={`rounded-2xl px-3 py-2 ${
                            msg.sender === "me" ? "bg-primary text-white" : "bg-k-100 text-k-900"
                          }`}
                        >
                          <p className="whitespace-pre-line text-sm">{msg.message}</p>
                        </div>

                        {msg.sender !== "me" && <span className="text-xs text-k-500">{formatTime(msg.time)}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 메시지 입력 영역 - 하단 고정 */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-end gap-2">
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full bg-k-100">
            <span className="text-k-600">📷</span>
          </button>

          <div className="flex-1 rounded-2xl border border-k-200 bg-white px-4 py-2">
            <textarea
              {...register("message", { required: true })}
              placeholder="댓글을 입력해 주세요"
              className="w-full resize-none border-none text-sm outline-none placeholder:text-k-400"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(onSubmit)();
                }
              }}
            />
          </div>

          <button
            type="submit"
            disabled={!messageValue.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary disabled:bg-k-200"
          >
            <span className="text-white">➤</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatContent;
