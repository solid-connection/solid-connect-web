import { useState } from "react";

import { tokenParse } from "@/utils/jwtUtils";

import { UserRole } from "@/types/mentor";

import usePatchMenteeCheckMentorings from "@/api/mentee/client/usePatchMenteeCheckMentorings";
import usePatchMentorCheckMentorings from "@/api/mentor/client/usePatchMentorCheckMentorings";
import useAuthStore from "@/lib/zustand/useAuthStore";

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
  const { accessToken } = useAuthStore();
  const isMentor =
    tokenParse(accessToken)?.role === UserRole.MENTOR || tokenParse(accessToken)?.role === UserRole.ADMIN;

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
