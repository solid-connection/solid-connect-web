import { useEffect } from "react";

import { VerifyStatus } from "@/types/mentee";

import { usePrefetchApplyMentoringList } from "@/api/mentee/client/useGetApplyMentoringList";

const usePrefetchMenteeMentoringListTab = () => {
  const { prefetchMenteeMentoringList } = usePrefetchApplyMentoringList();

  // 컴포넌트 마운트 시 프리페치
  useEffect(() => {
    // APPROVED 상태 데이터를 프리페치 (MY_MENTOR 탭용)
    const timer = setTimeout(() => {
      prefetchMenteeMentoringList(VerifyStatus.APPROVED);
    }, 1000);

    return () => clearTimeout(timer);
  }, [prefetchMenteeMentoringList]);
};
export default usePrefetchMenteeMentoringListTab;
