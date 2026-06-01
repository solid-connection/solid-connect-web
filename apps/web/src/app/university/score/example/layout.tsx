import type { Metadata } from "next";
import type { ReactNode } from "react";

import { NO_INDEX_ROBOTS } from "@/utils/seo";

export const metadata: Metadata = {
  title: "증명서 예시",
  robots: NO_INDEX_ROBOTS,
};

const ScoreExampleLayout = ({ children }: { children: ReactNode }) => children;

export default ScoreExampleLayout;
