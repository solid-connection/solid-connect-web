import type { Metadata } from "next";
import type { ReactNode } from "react";

import { NO_INDEX_ROBOTS } from "@/utils/seo";

export const metadata: Metadata = {
  title: "멘토 회원 전환",
  robots: NO_INDEX_ROBOTS,
};

const ApplyMentorLayout = ({ children }: { children: ReactNode }) => children;

export default ApplyMentorLayout;
