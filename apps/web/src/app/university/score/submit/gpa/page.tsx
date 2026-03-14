import type { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import ClientGpaForm from "./ClientGpaForm";

export const metadata: Metadata = {
  title: "성적 입력하기",
};

const SubmitGpaPage = () => {
  return (
    <>
      <TopDetailNavigation title="성적 입력하기" />
      <div className="w-full px-5">
        <ClientGpaForm />
      </div>
    </>
  );
};

export default SubmitGpaPage;
