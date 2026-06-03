import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import CommunityPageSkeleton from "./CommunityPageSkeleton";

const CommunityLoading = () => (
  <div className="w-full">
    <TopDetailNavigation title="커뮤니티" />
    <CommunityPageSkeleton />
  </div>
);

export default CommunityLoading;
