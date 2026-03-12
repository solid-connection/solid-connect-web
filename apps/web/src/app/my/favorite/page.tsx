import type { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

import FavoriteContent from "./_ui/FavoriteContent";

export const metadata: Metadata = {
  title: "관심학교",
};

const FavoritePage = () => {
  return (
    <>
      <TopDetailNavigation title="관심학교" />
      <div className="w-full px-5">
        <FavoriteContent />
      </div>
    </>
  );
};

export default FavoritePage;
