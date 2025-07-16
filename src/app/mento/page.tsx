import { Metadata } from "next";

import MentorClient from "./_components/MentorClient";

export const metadata: Metadata = {
  title: "멘토",
  description: "멘토 멘티 페이지",
};

const MentorPage = () => {
  return (
    <div className="px-5">
      <MentorClient />
    </div>
  );
};

export default MentorPage;
