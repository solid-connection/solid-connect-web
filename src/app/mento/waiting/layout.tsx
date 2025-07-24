import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

interface MentoWaitingLayoutProps {
  children: React.ReactNode;
}

const MentoWaitingLayout = ({ children }: MentoWaitingLayoutProps) => {
  return (
    <div>
      <TopDetailNavigation title="멘토 채팅" />
      <div className="min-h-screen">{children}</div>
    </div>
  );
};

export default MentoWaitingLayout;
