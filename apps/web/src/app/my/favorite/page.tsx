import type { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import { NO_INDEX_ROBOTS } from "@/utils/seo";

import FavoriteContent from "./_ui/FavoriteContent";

export const metadata: Metadata = {
  title: "관심학교",
  robots: NO_INDEX_ROBOTS,
};

const FavoritePage = () => {
  return (
    <>
      <TopDetailNavigation title="관심학교" />
      <div className="w-full px-5 md:px-0">
        <FavoriteContent />
      </div>
    </>
  );
};

export default FavoritePage;
