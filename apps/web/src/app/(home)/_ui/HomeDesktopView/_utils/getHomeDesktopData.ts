import { HOME_UNIVERSITY_LIST, isMatchedHomeUniversityName } from "@/constants/university";
import type { HomeUniversitySlug, ListUniversity } from "@/types/university";

type DesktopUniversityPreview = Pick<
  ListUniversity,
  "id" | "koreanName" | "homeUniversityName" | "region" | "country" | "logoImageUrl" | "studentCapacity"
>;

export type HomeDesktopData = {
  totalUniversityCount: number;
  countryCount: number;
  universityCountsByHome: Record<HomeUniversitySlug, number>;
  previewUniversities: DesktopUniversityPreview[];
};

const PREVIEW_UNIVERSITY_COUNT = 6;

export const getHomeDesktopData = (allUniversities: ListUniversity[]): HomeDesktopData => {
  const universityCountsByHome = { inha: 0, kyunghee: 0, chungang: 0 };

  for (const { slug, name } of HOME_UNIVERSITY_LIST) {
    universityCountsByHome[slug] = allUniversities.filter((university) =>
      isMatchedHomeUniversityName(university.homeUniversityName, name),
    ).length;
  }

  return {
    totalUniversityCount: allUniversities.length,
    countryCount: new Set(allUniversities.map((university) => university.country)).size,
    universityCountsByHome,
    previewUniversities: allUniversities.slice(0, PREVIEW_UNIVERSITY_COUNT).map((university) => ({
      id: university.id,
      koreanName: university.koreanName,
      homeUniversityName: university.homeUniversityName,
      region: university.region,
      country: university.country,
      logoImageUrl: university.logoImageUrl,
      studentCapacity: university.studentCapacity,
    })),
  };
};
