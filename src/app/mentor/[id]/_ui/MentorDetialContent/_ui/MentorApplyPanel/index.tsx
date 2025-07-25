"use client";

import { useState } from "react";

import IconConfirmCancelModal from "@/components/modal/IconConfirmCancelModal";

import { IconCheck, IconTime } from "@/public/svgs/mentor";

interface MentorApplyPanelProps {
  isDistribute?: boolean;
  isAleadyMatch?: boolean;
}

const MentorApplyPanel = ({ isDistribute = false, isAleadyMatch = false }: MentorApplyPanelProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // 버튼 텍스트 설정
  const getButtonText = () => {
    if (isDistribute) return "방해금지시간";
    if (isAleadyMatch) return "매칭완료된 멘토";
    return "멘토 신청하기";
  };

  // 버튼이 비활성화되어야 하는지 확인
  const isDisabled = isDistribute || isAleadyMatch;

  // isDistribute에 따른 모달 내용 설정
  const modalConfig = isDistribute
    ? {
        icon: <IconTime />,
        title: "지금은 방해금지 시간이에요.",
        content: "방해 금지 시간이 지난 후 멘티 신청을 할 수 있어요.\n내일 아침 다시 신청해주세요.",
        isOneButton: true,
      }
    : {
        icon: <IconCheck />,
        title: "멘토 신청이 완료되었어요!",
        content: "멘토가 신청을 수락하면 대화를 시작할 수 있어요.\n대화 수락까지 조금만 기다려주세요.",
        isOneButton: false,
        cancelText: "홈으로",
        approveText: "다른멘토 찾기",
      };

  return (
    <>
      <button
        onClick={() => !isDisabled && setIsModalOpen(true)}
        disabled={isDisabled}
        className={`flex h-[41px] w-full items-center justify-center gap-3 rounded-[20px] px-5 py-[10px] font-medium ${
          isDisabled ? "cursor-not-allowed bg-k-100 text-k-400" : "bg-primary text-white"
        }`}
      >
        {getButtonText()}
      </button>
      <IconConfirmCancelModal
        icon={modalConfig.icon}
        isOpen={isModalOpen}
        title={modalConfig.title}
        content={modalConfig.content}
        isOneButton={modalConfig.isOneButton}
        cancelText={!modalConfig.isOneButton ? modalConfig.cancelText : undefined}
        approveText={!modalConfig.isOneButton ? modalConfig.approveText : undefined}
        handleCancel={() => setIsModalOpen(false)}
        handleConfirm={() => setIsModalOpen(false)}
      />
    </>
  );
};
export default MentorApplyPanel;
