import { Metadata } from "next";

import FavoriteContent from "./_ui/FavoriteContent";

export const metadata: Metadata = {
  title: "관심학교",
};

const FavoritePage = () => {
  return (
    <>
      <FavoriteContent />
    </>
  );
};

export default FavoritePage;
