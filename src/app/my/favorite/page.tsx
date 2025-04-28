import { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

import FavoriteContent from "./FavoriteContent";

export const metadata: Metadata = {
  title: "즐겨찾기",
};

const FavoritePage = () => {
  return (
    <>
      <TopDetailNavigation title="즐겨찾기" />
      <FavoriteContent />
    </>
  );
};

export default FavoritePage;
