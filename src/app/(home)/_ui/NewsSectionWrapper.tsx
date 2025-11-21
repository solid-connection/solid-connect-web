"use client";

import dynamic from "next/dynamic";

import NewsSectionSkeleton from "./NewsSection/skeleton";

const NewsSectionDynamic = dynamic(() => import("./NewsSection"), {
  ssr: false,
  loading: () => <NewsSectionSkeleton />,
});

interface NewsSectionWrapperProps {
  newsList: any[];
}

const NewsSectionWrapper = ({ newsList }: NewsSectionWrapperProps) => {
  return <NewsSectionDynamic newsList={newsList} />;
};

export default NewsSectionWrapper;
