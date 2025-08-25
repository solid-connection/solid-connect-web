import { useState } from "react";

import usePatchMenteeCheckMentorings from "@/api/mentee/client/usePatchMenteeCheckMentorings";
import usePatchMentorCheckMentorings from "@/api/mentor/client/usePatchMentorCheckMentorings";
import useJWTParseRouteHandler from "@/lib/hooks/useJWTParseRouteHandler";

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
  const { isMentor } = useJWTParseRouteHandler();

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
