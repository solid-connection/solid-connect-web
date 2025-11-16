import { Metadata } from "next";
import dynamic from "next/dynamic";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

const LanguageTestSubmitForm = dynamic(() => import("./LanguageTestSubmitForm"), { ssr: false });

export const metadata: Metadata = {
  title: "성적 입력하기",
};

const SubmitLanguageTestPage = () => {
  return (
    <>
      <TopDetailNavigation title="성적 입력하기" />
      <div className="w-full px-5">
        <LanguageTestSubmitForm />
      </div>
    </>
  );
};

export default SubmitLanguageTestPage;
