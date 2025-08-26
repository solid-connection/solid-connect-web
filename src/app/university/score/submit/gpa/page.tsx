import { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

import GpaSubmitForm from "./GpaSubmitForm";

export const metadata: Metadata = {
  title: "성적 입력하기",
};

const SubmitGpaPage = () => {
  return (
    <>
      <TopDetailNavigation title="성적 입력하기" />
      <GpaSubmitForm />
    </>
  );
};

export default SubmitGpaPage;
