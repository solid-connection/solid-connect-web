import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "커뮤니티",
};

const CommunityIndex = () => {
  redirect("/community/FREE");
};

export default CommunityIndex;
