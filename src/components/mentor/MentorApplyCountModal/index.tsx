import MentorApplyCountContent from "./ui/MentorApplyCountContent";

import getMentoringNewCount from "@/api/mentor/server/getMentoringNewCount";

const MentorApplyCountModal = async () => {
  const { count } = await getMentoringNewCount();

  return <MentorApplyCountContent count={count} />;
};

export default MentorApplyCountModal;
