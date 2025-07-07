import { useState } from "react";

import { MentorTab } from "@/types/mentor";

import { IconDirectionDown } from "@/public/svgs/mentor";

type MentorDropDownProps = {
  selectedTab: string;
  setSelectedTab: React.Dispatch<React.SetStateAction<MentorTab>>;
};

const MentorDropDown = (props: MentorDropDownProps) => {
  const { selectedTab, setSelectedTab } = props;
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const toggleDropdown = () => {
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
        <div className="shadow-sdwC absolute left-0 top-full z-10 rounded-t-[4px] border bg-k-100">
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
    </div>
  );
};

export default MentorDropDown;
