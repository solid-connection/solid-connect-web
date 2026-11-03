import type { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import { NO_INDEX_ROBOTS } from "@/utils/seo";
import GpaSubmitForm from "./GpaSubmitForm";

export const metadata: Metadata = {
  title: "성적 입력하기",
  robots: NO_INDEX_ROBOTS,
};

const SubmitGpaPage = () => {
  return (
    <>
      <TopDetailNavigation title="성적 입력하기" />
      <div className="w-full px-5 md:px-0">
        <GpaSubmitForm />
      </div>
    </>
  );
};

export default SubmitGpaPage;
