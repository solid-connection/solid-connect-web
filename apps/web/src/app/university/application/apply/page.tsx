import type { Metadata } from "next";
import { NO_INDEX_ROBOTS } from "@/utils/seo";
import ApplyPageContent from "./ApplyPageContent";

export const metadata: Metadata = {
  title: "지원하기",
  robots: NO_INDEX_ROBOTS,
};
const ApplyPage = () => {
  return (
    <div className="w-full">
      <ApplyPageContent />
    </div>
  );
};

export default ApplyPage;
