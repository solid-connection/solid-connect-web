import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

interface MentoLayoutProps {
  children: React.ReactNode;
}

const MentoLayout = ({ children }: MentoLayoutProps) => {
  return (
    <div>
      <TopDetailNavigation title="멘토" />
      <div className="min-h-screen px-5">{children}</div>
    </div>
  );
};

export default MentoLayout;
