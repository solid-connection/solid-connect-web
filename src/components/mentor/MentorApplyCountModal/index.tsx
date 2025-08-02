import MentorApplyCountContent from "./ui/MentorApplyCountContent";

import getMentoringNewCount from "@/api/mentor/server/getMentoringNewCount";

const MentorApplyCountModal = async () => {
  const { data } = await getMentoringNewCount();
  const count = data?.count || 0;

  return <MentorApplyCountContent count={count} />;
};

export default MentorApplyCountModal;
