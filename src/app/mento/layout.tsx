import PathBasedNavigation from "@/components/layout/PathBasedNavigation";

interface MentoLayoutProps {
  children: React.ReactNode;
}

const CHAT_NAVIGATION_TITLES = {
  "/mento/chat": "멘토 채팅",
  "/mento": "멘토",
  "/mento/modify": "멘토 수정",
  "/mento/waiting": "멘토 대기",
};

const MentoLayout = ({ children }: MentoLayoutProps) => {
  return (
    <>
      <PathBasedNavigation customTitles={CHAT_NAVIGATION_TITLES} />
      {children}
    </>
  );
};

export default MentoLayout;
