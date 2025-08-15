"use client";

import MentorApplyCountContent from "@/components/mentor/MentorApplyCountContent";
import IconAlertModal from "@/components/modal/IconAlertModal";
import IconConfirmModal from "@/components/modal/IconConfirmModal";
import CloudSpinner from "@/components/ui/CloudSpinner";

import { useAlertModalStore } from "@/lib/zustand/useAlertModalStore";
import { useConfirmModalStore } from "@/lib/zustand/useConfirmModalStore";
import { useIsFetching } from "@tanstack/react-query";

const ClientModal = () => {
  const { isOpen, payload, confirm, reject } = useConfirmModalStore();
  const { isOpen: alertOpen, payload: alertPayload, acknowledge, close } = useAlertModalStore();

  const isFetching = useIsFetching();

  return (
    <>
      {isFetching ? (
        <div aria-live="polite" aria-busy="true" className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2">
          <CloudSpinner />
        </div>
      ) : null}

      <MentorApplyCountContent />

      <IconAlertModal
        isOpen={alertOpen}
        title={alertPayload?.title || "확인"}
        content={alertPayload?.content || ""}
        icon={alertPayload?.icon}
        buttonText={alertPayload?.buttonText || "확인"}
        onAcknowledge={acknowledge}
        onClose={close}
      />
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
