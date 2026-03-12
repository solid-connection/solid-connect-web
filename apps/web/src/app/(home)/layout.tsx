import TopLogoBar from "@/components/ui/TopLogoBar";

interface HomeLayoutProps {
  children: React.ReactNode;
}

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <>
      <TopLogoBar />
      {children}
    </>
  );
};

export default HomeLayout;
