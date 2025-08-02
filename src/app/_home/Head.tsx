"use client";

import Script from "next/script";

import { News } from "@/types/news";

// src/app/head.tsx
type HeadProps = { newsList: News[] };

const Head = ({ newsList }: HeadProps) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: newsList.slice(0, 3).map((n, idx) => ({
      "@type": "NewsArticle",
      position: idx + 1,
      headline: n.title,
      description: n.description,
      url: n.url,
      image: n.imageUrl,
    })),
  };
  return (
    <Script
      id="ld-json-homepage"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
};
export default Head;
