import { Metadata } from "next";

import ModifyContent from "./_components/ModifyContent";

export const metadata: Metadata = {
  title: "멘토",
  description: "멘토 멘티 페이지",
};

const ModifyPage = () => {
  return (
    <div className="px-5">
      <ModifyContent />
    </div>
  );
};

export default ModifyPage;
