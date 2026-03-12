import { useState } from "react";
import { usePatchMenteeCheckMentorings, usePatchMentorCheckMentorings } from "@/apis/mentor";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { UserRole } from "@/types/mentor";

interface UseExpandCardClickHandlerReturn {
  isExpanded: boolean;
  isCheckedState: boolean;
  handleExpandClick: () => void;
}
interface UseExpandCardClickHandlerProps {
  mentoringId: number;
  initChecked?: boolean;
}

const useExpandCardClickHandler = ({
  mentoringId,
  initChecked = false,
}: UseExpandCardClickHandlerProps): UseExpandCardClickHandlerReturn => {
  const userRole = useAuthStore((state) => state.userRole);
  const isMentor = userRole === UserRole.MENTOR;

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isCheckedState, setIsCheckedState] = useState<boolean>(initChecked || false);
  const { mutate: patchCheckMentorings } = usePatchMentorCheckMentorings();
  const { mutate: patchMenteeCheckMentorings } = usePatchMenteeCheckMentorings();

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
    if (!isCheckedState) {
      setIsCheckedState(true);
    }
    if (!isCheckedState) {
      if (isMentor) {
        patchCheckMentorings({ checkedMentoringIds: [mentoringId] });
      } else {
        patchMenteeCheckMentorings({ checkedMentoringIds: [mentoringId] });
      }
    }
  };
  return {
    isExpanded,
    isCheckedState,
    handleExpandClick,
  };
};
export default useExpandCardClickHandler;
