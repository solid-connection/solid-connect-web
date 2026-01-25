import { useEffect } from "react";
import { usePrefetchMentorList } from "@/apis/mentor";
import { FilterTab } from "@/types/mentor";

const usePrefetchMentorFindTab = () => {
  const { prefetchMentorList } = usePrefetchMentorList();

  // 컴포넌트 마운트 시 모든 탭 데이터 프리페치
  useEffect(() => {
    const prefetchAllTabs = async () => {
      // 현재 선택된 탭안 전체탭 제외한 나머지 탭들 프리페치
      const tabsToPrefetch = Object.values(FilterTab).filter((tab) => tab !== FilterTab.ALL);
      tabsToPrefetch.forEach((tab) => {
        prefetchMentorList(tab);
      });
    };

    // 1초 후에 프리페치 실행 (초기 로딩 후)
    const timer = setTimeout(prefetchAllTabs, 1000);
    return () => clearTimeout(timer);
  }, [prefetchMentorList]);
};
export default usePrefetchMentorFindTab;
