import type { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import ClientLanguageTestSubmitForm from "./ClientLanguageTestSubmitForm";

export const metadata: Metadata = {
  title: "성적 입력하기",
};

const SubmitLanguageTestPage = () => {
  return (
    <>
      <TopDetailNavigation title="성적 입력하기" />
      <div className="w-full px-5">
        <ClientLanguageTestSubmitForm />
      </div>
    </>
  );
};

export default SubmitLanguageTestPage;
