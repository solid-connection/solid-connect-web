"use client";

import { useEffect } from "react";

import MentorApplyCountContent from "@/components/mentor/MentorApplyCountContent";
import IconAlertModal from "@/components/modal/IconAlertModal";
import IconConfirmModal from "@/components/modal/IconConfirmModal";
import SurveyModal from "@/components/modal/SurveyModal";
import CloudSpinner from "@/components/ui/CloudSpinner";

import { useAlertModalStore } from "@/lib/zustand/useAlertModalStore";
import { useConfirmModalStore } from "@/lib/zustand/useConfirmModalStore";
import { useSurveyModalStore } from "@/lib/zustand/useSurveyModalStore";
import { useIsFetching } from "@tanstack/react-query";

const ClientModal = () => {
  const { isOpen, payload, confirm, reject } = useConfirmModalStore();
  const { isOpen: alertOpen, payload: alertPayload, acknowledge, close } = useAlertModalStore();
  const {
    isOpen: surveyOpen,
    close: closeSurvey,
    closeForWeek: closeSurveyForWeek,
    checkAndOpen,
  } = useSurveyModalStore();

  const isFetching = useIsFetching({
    predicate: (query) => query.meta?.showGlobalSpinner !== false,
  });

  // 페이지 로드 시 만족도 조사 모달 표시 여부 확인
  useEffect(() => {
    checkAndOpen();
  }, [checkAndOpen]);

  return (
    <>
      {isFetching ? (
        <div aria-live="polite" aria-busy="true" className="fixed inset-0 z-50 flex items-center justify-center">
          <CloudSpinner />
        </div>
      ) : null}

      <MentorApplyCountContent />

      <SurveyModal isOpen={surveyOpen} onClose={closeSurvey} onCloseForWeek={closeSurveyForWeek} />

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
