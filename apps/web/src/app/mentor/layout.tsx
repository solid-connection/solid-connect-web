import PathBasedNavigation from "@/components/layout/PathBasedNavigation";

interface MentorLayoutProps {
  children: React.ReactNode;
}

const CHAT_NAVIGATION_TITLES = {
  "/mentor/chat": "멘토 채팅",
  "/mentor": "멘토",
  "/mentor/modify": "멘토 수정",
  "/mentor/waiting": "멘토 대기",
  "/mentor/": "멘토 페이지",
};

const MentorLayout = ({ children }: MentorLayoutProps) => {
  return (
    <>
      <PathBasedNavigation customTitles={CHAT_NAVIGATION_TITLES} />
      {children}
    </>
  );
};

export default MentorLayout;
