import React from "react";

interface EmptyMentorStateProps {
  message?: string;
}

const EmptyMentorState = ({ message = "나와 매칭된 멘토입니다" }: EmptyMentorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center text-gray-500">{message}</div>
    </div>
  );
};

export default EmptyMentorState;
