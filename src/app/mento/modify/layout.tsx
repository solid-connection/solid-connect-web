import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

interface MentoModifyLayoutProps {
  children: React.ReactNode;
}

const MentoModifyLayout = ({ children }: MentoModifyLayoutProps) => {
  return (
    <div>
      <TopDetailNavigation title="멘토 수정" />
      <div className="min-h-screen">{children}</div>
    </div>
  );
};

export default MentoModifyLayout;
