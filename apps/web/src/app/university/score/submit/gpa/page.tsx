import type { Metadata } from "next";
import dynamic from "next/dynamic";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

const ClientGpaForm = dynamic(() => import("./GpaSubmitForm"), { ssr: false });

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
