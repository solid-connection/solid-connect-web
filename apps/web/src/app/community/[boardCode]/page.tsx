import type { Metadata } from "next";
import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import CommunityPageContent from "./CommunityPageContent";

export const metadata: Metadata = {
  title: "커뮤니티",
};

interface CommunityPageProps {
  params: {
    boardCode: string;
  };
}

const CommunityPage = ({ params }: CommunityPageProps) => {
  const { boardCode } = params;

  return (
    <div className="w-full">
      <TopDetailNavigation title="커뮤니티" />
      <CommunityPageContent boardCode={boardCode} />
    </div>
  );
};

export default CommunityPage;
