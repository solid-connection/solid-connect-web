import ReusableDropdown, { DropdownItem } from "../../../../components/ui/ReusableDropdown";
import ToolTipMessage from "../../../../components/ui/TooltipMessage";

import { MentorTab } from "@/types/mentor";

import useFirstVisit from "@/hooks/useFirstVisit";

const mentoDropdownItems: DropdownItem[] = [
  {
    id: "my-mentor",
    label: MentorTab.MY_MENTOR,
    value: MentorTab.MY_MENTOR,
  },
  {
    id: "my-mentee",
    label: MentorTab.MY_MENTEE,
    value: MentorTab.MY_MENTEE,
  },
];

interface MentorDropDownProps {
  selectedTab: string;
  setSelectedTab: React.Dispatch<React.SetStateAction<MentorTab>>;
}

const MentorDropDown = ({ selectedTab, setSelectedTab }: MentorDropDownProps) => {
  const { isFirstVisit } = useFirstVisit();

  const handleSelect = (value: string) => {
    setSelectedTab(value as MentorTab);
  };

  return (
    <div className="relative h-[40px] w-[120px]">
      <ReusableDropdown items={mentoDropdownItems} selectedValue={selectedTab} onSelect={handleSelect} />

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
