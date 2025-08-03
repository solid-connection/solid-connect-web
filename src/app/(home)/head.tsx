import getRecommendedUniversity from "@/api/university/server/getRecommendedUniversity";
import { fetchAllNews } from "@/lib/firebaseNews";

const Head = async () => {
  const newsList = await fetchAllNews();
  const { data } = await getRecommendedUniversity();
  const recommendedColleges = data?.recommendedUniversities || [];

  // ─── LCP 이미지 Preload ───
  const lcpImage =
    recommendedColleges.length > 0 && recommendedColleges[0].backgroundImageUrl
      ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${recommendedColleges[0].backgroundImageUrl}`
      : "/images/default-university.jpg";

  const preloadLink = <link rel="preload" as="image" href={lcpImage} fetchPriority="high" />;

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
      {/* LCP 이미지 Preload */}
      {preloadLink}

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
