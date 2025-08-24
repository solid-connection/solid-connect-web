import { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

import FavoriteContent from "./_ui/FavoriteContent";

export const metadata: Metadata = {
  title: "관심학교",
};

const FavoritePage = () => {
  return (
    <>
      <TopDetailNavigation title="관심학교" />
      <FavoriteContent />
    </>
  );
};

export default FavoritePage;
