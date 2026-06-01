import type { Metadata } from "next";

import { NO_INDEX_ROBOTS } from "@/utils/seo";
import MentorClient from "./_ui/MentorClient";

const title = "교환학생 멘토 찾기 | 솔리드커넥션";
const description = "교환학생을 다녀온 멘토의 국가, 파견 대학, 합격 팁을 확인하고 나에게 맞는 멘토링을 신청해보세요.";

export const metadata: Metadata = {
  title,
  description,
  robots: NO_INDEX_ROBOTS,
};

const MentorPage = () => {
  return (
    <div className="w-full px-5">
      <MentorClient />
    </div>
  );
};

export default MentorPage;
