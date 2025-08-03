import { Metadata } from "next";
import Link from "next/link";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

import GpaSubmitForm from "./GpaSubmitForm";

export const metadata: Metadata = {
  title: "성적 입력하기",
};

const SubmitGpaPage = () => {
  return (
    <>
      <TopDetailNavigation title="성적 입력하기" />
      <Tab />
      <GpaSubmitForm />
    </>
  );
};

type TabProps = {
  color?: {
    activeBtn?: string;
    deactiveBtn?: string;
    activeBtnFont?: string;
    deactiveBtnFont?: string;
  };
};

const Tab = ({ color }: TabProps) => {
  const defaultColor = {
    activeBtnFont: "#000",
    deactiveBtnFont: "#7D7D7D",
  };
  const combinedColor = { ...defaultColor, ...color };
  return (
    <div className="flex h-9 w-full cursor-pointer flex-row text-sm font-medium">
      <Link
        href="/score/submit/language-test"
        style={{ color: combinedColor.deactiveBtnFont }}
        className="flex w-full items-center justify-center bg-white"
      >
        <div>공인어학</div>
      </Link>
      <span
        style={{ color: combinedColor.activeBtnFont }}
        className="flex w-full items-center justify-center border-b-2 border-secondary bg-white"
      >
        <div>학점</div>
      </span>
    </div>
  );
};

export default SubmitGpaPage;
