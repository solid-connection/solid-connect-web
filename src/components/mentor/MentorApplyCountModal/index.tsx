import MentorApplyCountContent from "./ui/MentorApplyCountContent";

import getMentoringNewCount from "@/api/mentor/server/getMentoringNewCount";

const MentorApplyCountModal = async () => {
  const { count } = await getMentoringNewCount();

  if (count === 0) return null; // 신규 신청 없으면 표시 X
  return <MentorApplyCountContent count={count} />;
};

export default MentorApplyCountModal;
