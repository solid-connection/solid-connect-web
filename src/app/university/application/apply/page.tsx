import { Metadata } from "next";

import ApplyPageContent from "./ApplyPageContent";

export const metadata: Metadata = {
  title: "지원하기",
};

const ApplyPage = () => {
  return (
    <>
      <ApplyPageContent />
    </>
  );
};

export default ApplyPage;
