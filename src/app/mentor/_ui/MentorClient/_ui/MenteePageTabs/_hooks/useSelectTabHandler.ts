import { useState } from "react";

import { MenteeTab } from "@/types/mentor";

interface UseSelectTabHandlerReturn {
  selectedTab: MenteeTab;
  handleTabChange: (tab: MenteeTab) => void;
  handleViewAllClick: () => void;
}

const useSelectTabHandler = (): UseSelectTabHandlerReturn => {
  const [selectedTab, setSelectedTab] = useState<MenteeTab>(MenteeTab.MY_MENTOR);

  const handleViewAllClick = () => {
    if (selectedTab === MenteeTab.MY_MENTOR) {
      console.log("전체보기 클릭: 진행 중인 멘토링");
      // 전체보기 페이지로 이동하는 로직
    } else {
      console.log("전체보기 클릭: 신청 목록");
      // 전체보기 페이지로 이동하는 로직
    }
  };
  const handleTabChange = (tab: MenteeTab) => {
    setSelectedTab(tab);
  };

  return {
    selectedTab,
    handleTabChange,
    handleViewAllClick,
  };
};
export default useSelectTabHandler;
