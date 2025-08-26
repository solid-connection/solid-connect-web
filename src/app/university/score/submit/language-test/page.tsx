import { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

import LanguageTestSubmitForm from "./LanguageTestSubmitForm";

export const metadata: Metadata = {
  title: "성적 입력하기",
};

const SubmitLanguageTestPage = () => {
  return (
    <>
      <TopDetailNavigation title="성적 입력하기" />
      <LanguageTestSubmitForm />
    </>
  );
};

export default SubmitLanguageTestPage;
