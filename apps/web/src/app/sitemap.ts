import type { MetadataRoute } from "next";
import { getAllUniversities } from "@/apis/universities/server";
import { getHomeUniversitySlugByName, HOME_UNIVERSITY_LIST, HOME_UNIVERSITY_SLUGS } from "@/constants/university";
import { createUrl, getSiteUrl, isNonIndexSiteUrl } from "@/utils/seo";

type SitemapEntry = MetadataRoute.Sitemap[number];

export const revalidate = 86400;

const toSitemapEntry = (
  path: string,
  changeFrequency: SitemapEntry["changeFrequency"],
  priority: number,
  lastModified?: Date | string,
): SitemapEntry => ({
  url: createUrl(path),
  ...(lastModified ? { lastModified } : {}),
  changeFrequency,
  priority,
});

const getStaticRoutes = (): MetadataRoute.Sitemap => [
  toSitemapEntry("/", "daily", 1),
  toSitemapEntry("/university", "weekly", 0.85),
  toSitemapEntry("/university/search", "weekly", 0.6),
  toSitemapEntry("/terms", "yearly", 0.35),
  ...HOME_UNIVERSITY_LIST.map((university) => toSitemapEntry(`/university/${university.slug}`, "weekly", 0.8)),
];

const getUniversityDetailRoutes = async (): Promise<MetadataRoute.Sitemap> => {
  let universities: Awaited<ReturnType<typeof getAllUniversities>>;

  try {
    universities = await getAllUniversities();
  } catch {
    return [];
  }

  const seenUrls = new Set<string>();

  return universities.flatMap((university) => {
    const homeUniversitySlug = getHomeUniversitySlugByName(university.homeUniversityName);

    if (!homeUniversitySlug || !HOME_UNIVERSITY_SLUGS.includes(homeUniversitySlug)) {
      return [];
    }

    const entry = toSitemapEntry(`/university/${homeUniversitySlug}/${university.id}`, "monthly", 0.7);

    if (seenUrls.has(entry.url)) {
      return [];
    }

    seenUrls.add(entry.url);
    return [entry];
  });
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  if (isNonIndexSiteUrl(siteUrl)) {
    return [];
  }

  const universityDetailRoutes = await getUniversityDetailRoutes();

  return [...getStaticRoutes(), ...universityDetailRoutes];
}
