import type { Metadata } from "next";
import ApplyPageContent from "./ApplyPageContent";

export const metadata: Metadata = {
  title: "지원하기",
};
const ApplyPage = () => {
  return (
    <div className="w-full">
      <ApplyPageContent />
    </div>
  );
};

export default ApplyPage;
