import Link from "next/link";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import tabStyles from "@/components/ui/tab.module.css";

import GpaSubmitForm from "./GpaSubmitForm";

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
    <div className={tabStyles.tabContainer}>
      <Link
        href="/score/submit/language-test"
        style={{ color: combinedColor.deactiveBtnFont }}
        className={tabStyles.tabButton}
      >
        <div>공인어학</div>
      </Link>
      <span style={{ color: combinedColor.activeBtnFont }} className={tabStyles.tabButtonActive}>
        <div>학점</div>
      </span>
    </div>
  );
};

export default SubmitGpaPage;
