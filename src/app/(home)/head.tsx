import { fetchAllNews } from "@/lib/firebaseNews";

const Head = async () => {
  const newsList = await fetchAllNews();

  /** ───── JSON‑LD 구조화 데이터 ───── */
  const structuredData =
    newsList.length === 0
      ? null
      : {
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
    <>
      {/* JSON‑LD (뉴스 3개) */}
      {structuredData && (
        <script
          id="ld-json-homepage"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
    </>
  );
};
export default Head;
