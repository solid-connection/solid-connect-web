import ReusableDropdown from "@/components/ui/ReusableDropdown";
import ToolTipMessage from "@/components/ui/TooltipMessage";

import useFirstVisit from "./_hooks/useFirstVisit";

import { MentorTab } from "@/types/mentor";

import { IconDirectionDown } from "@/public/svgs/mentor";

const mentoDropdownItems: MentorTab[] = [MentorTab.MY_MENTOR, MentorTab.MY_MENTEE];

interface MentorDropDownProps {
  selectedTab: MentorTab;
  setSelectedTab: React.Dispatch<React.SetStateAction<MentorTab>>;
}

const MentorDropDown = ({ selectedTab, setSelectedTab }: MentorDropDownProps) => {
  const { isFirstVisit } = useFirstVisit();

  const handleSelect = (value: MentorTab) => {
    setSelectedTab(value);
  };

  return (
    <div className="relative h-[40px] w-[140px]">
      <ReusableDropdown<MentorTab> items={mentoDropdownItems} selectedValue={selectedTab} onSelect={handleSelect}>
        <button className="flex h-full w-full items-center justify-between px-4 text-lg font-semibold leading-normal text-k-900">
          {selectedTab}
          <span className="h-[30px] w-[30px]">
            <IconDirectionDown />
          </span>
        </button>
      </ReusableDropdown>

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
