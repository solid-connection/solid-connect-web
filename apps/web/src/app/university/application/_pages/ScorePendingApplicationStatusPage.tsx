"use client";

import { useEffect } from "react";
import { useUniversitySearch } from "@/apis/universities";
import { showIconToast } from "@/lib/toast/showIconToast";
import RestrictedApplicationStatusView from "../_components/RestrictedApplicationStatusView";

const SCORE_PENDING_MESSAGE = "성적 승인이 아직 안되었어요! 승인 완료 후에 지원자 수 확인이 가능합니다";

const ScorePendingApplicationStatusPage = () => {
  const { data: universities = [], isLoading } = useUniversitySearch("", undefined, { useDefaultTermId: true });

  useEffect(() => {
    showIconToast("cap", SCORE_PENDING_MESSAGE);
  }, []);

  return (
    <RestrictedApplicationStatusView
      universities={universities}
      isLoading={isLoading}
      onLockedRowClick={() => showIconToast("cap", SCORE_PENDING_MESSAGE)}
    />
  );
};

export default ScorePendingApplicationStatusPage;
