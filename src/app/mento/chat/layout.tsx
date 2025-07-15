import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

interface MentoChatLayoutProps {
  children: React.ReactNode;
}

const MentoChatLayout = ({ children }: MentoChatLayoutProps) => {
  return (
    <div>
      <TopDetailNavigation title="멘토 채팅" />
      <div className="min-h-screen">{children}</div>
    </div>
  );
};

export default MentoChatLayout;
