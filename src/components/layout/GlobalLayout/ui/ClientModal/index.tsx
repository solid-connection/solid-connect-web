"use client";

import MentorApplyCountContent from "@/components/mentor/MentorApplyCountContent";
import IconConfirmModal from "@/components/modal/IconConfirmModal";

import { useConfirmModalStore } from "@/lib/zustand/useConfirmModalStore";

const ClientModal = () => {
  const { isOpen, payload, confirm, reject } = useConfirmModalStore();

  return (
    <>
      <MentorApplyCountContent />
      <IconConfirmModal
        isOpen={isOpen}
        title={payload?.title || "확인"}
        content={payload?.content || "정말로 이 작업을 진행하시겠습니까?"}
        icon={payload?.icon}
        approveMessage={payload?.approveMessage || "확인"}
        rejectMessage={payload?.rejectMessage || "취소"}
        onConfirm={confirm}
        onClose={reject}
      />
    </>
  );
};
export default ClientModal;
