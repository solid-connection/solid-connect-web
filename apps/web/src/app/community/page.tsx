import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { NO_INDEX_ROBOTS } from "@/utils/seo";

export const metadata: Metadata = {
  title: "커뮤니티",
  robots: NO_INDEX_ROBOTS,
};

const CommunityIndex = () => {
  redirect("/community/FREE");
};

export default CommunityIndex;
