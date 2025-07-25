import { useState } from "react";

import IconConfirmCancelModal from "@/components/modal/IconConfirmCancelModal";

import { IconCheck } from "@/public/svgs/mentor";

const MentorApplyPanel = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const modalConfig = {
    icon: <IconCheck />,
    title: "멘토 신청이 완료되었어요!",
    content: "멘토가 신청을 수락하면 대화를 시작할 수 있어요.\n대화 수락까지 조금만 기다려주세요.",
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex h-[41px] w-1/2 flex-shrink-0 items-center justify-center gap-3 rounded-[20px] bg-primary px-5 py-[10px] font-medium text-white"
      >
        멘토 신청하기
      </button>
      <IconConfirmCancelModal
        icon={modalConfig.icon}
        isOpen={isModalOpen}
        title={modalConfig.title}
        content={modalConfig.content}
        handleCancel={() => setIsModalOpen(false)}
        handleConfirm={() => setIsModalOpen(false)}
        cancelText="홈으로"
        approveText="다른 멘토 찾기"
      />
    </>
  );
};

export default MentorApplyPanel;
