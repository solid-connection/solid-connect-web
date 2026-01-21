import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "지원하기",
};
const ApplyPageContentDynamic = dynamic(() => import("./ApplyPageContent"), {
  ssr: false,
  loading: () => null,
});

const ApplyPage = () => {
  return (
    <div className="w-full">
      <ApplyPageContentDynamic />
    </div>
  );
};

export default ApplyPage;
