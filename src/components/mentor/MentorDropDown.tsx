import { useEffect, useState } from "react";

import ToolTipMessage from "../ui/TooltipMessage";

import { MentorTab } from "@/types/mentor";

import { IconDirectionDown } from "@/public/svgs/mentor";

type MentorDropDownProps = {
  selectedTab: string;
  setSelectedTab: React.Dispatch<React.SetStateAction<MentorTab>>;
};

// TO do 추후에 로컬 스토리지 키를 환경 변수로 관리하는 것이 좋습니다.
// 현재는 간단한 예시로 로컬 스토리지 키를 상수로 정의합니다.
// 또한 동일 디바이스에서 다른 유저 로그인 시에도 첫 방문 메시지가 표시되지 않도록 로컬 스토리지 키를 재설정하는 로직 필요합니다
// 로컬스토리지 관련 로직 분리가필요 허나 비즈니스 로직 관련 폴더가 없어 논의 필요
const MENTO_FIRST_VISIT_LOCAL_STORAGE_KEY = "mentor-dropdown-first-visit";

const MentorDropDown = ({ selectedTab, setSelectedTab }: MentorDropDownProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // 찾방문
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(false);
  // 첫 방문 확인 및 메시지 표시 로직
  useEffect(() => {
    const hasVisited = localStorage.getItem(MENTO_FIRST_VISIT_LOCAL_STORAGE_KEY);
    if (!hasVisited) {
      setIsFirstVisit(true);
    }
  }, []);

  const toggleDropdown = () => {
    // 첫 방문 메시지 닫기
    if (isFirstVisit) {
      localStorage.setItem(MENTO_FIRST_VISIT_LOCAL_STORAGE_KEY, "true");
      setIsFirstVisit(false);
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleTabChange = (tab: MentorTab) => {
    setSelectedTab(tab);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative inline-flex">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-1 whitespace-nowrap text-lg font-semibold leading-normal text-k-900"
      >
        {selectedTab}
        <span className="h-[30px] w-[30px]">
          <IconDirectionDown />
        </span>
      </button>

      {isDropdownOpen && (
        <div className="absolute left-0 top-full z-10 rounded-t-[4px] border bg-k-100 shadow-sdwC">
          <button
            onClick={() => handleTabChange(MentorTab.MY_MENTOR)}
            className={`h-[30px] w-[100px] rounded-t-[4px] px-[20px] text-sm font-medium leading-normal text-k-700 ${
              selectedTab === MentorTab.MY_MENTOR ? "bg-primary-100" : "bg-k-0"
            }`}
          >
            {MentorTab.MY_MENTOR}
          </button>
          <button
            onClick={() => handleTabChange(MentorTab.MY_MENTEE)}
            className={`h-[30px] w-[100px] rounded-b-[4px] px-[20px] text-sm font-medium leading-normal text-k-700 ${
              selectedTab === MentorTab.MY_MENTEE ? "bg-primary-100" : "bg-k-0"
            }`}
          >
            {MentorTab.MY_MENTEE}
          </button>
        </div>
      )}
      {/* 첫 방문 메시지 모달 */}
      {isFirstVisit && (
        <div className="absolute left-0 top-full z-50 mt-2 h-[58px] w-[170px]">
          <ToolTipMessage
            message={`탭을 클릭하여 나의\n멘티를 확인할 수 있어요.`}
            bgColor="secondary"
            textColor="k-0"
          />
        </div>
      )}
    </div>
  );
};

export default MentorDropDown;
