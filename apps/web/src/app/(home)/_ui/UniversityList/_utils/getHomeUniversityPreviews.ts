import { HOME_UNIVERSITY_LIST, isMatchedHomeUniversityName } from "@/constants/university";
import { type ListUniversity, RegionEnumExtend } from "@/types/university";
import type { HomeUniversityPreview, HomeUniversityPreviewList } from "../types";

const PREVIEW_UNIVERSITY_COUNT = 3;
const PREVIEW_LANGUAGE_REQUIREMENT_COUNT = 3;

const getPreviewUniversities = (universities: ListUniversity[]): HomeUniversityPreview[] => {
  return universities.slice(0, PREVIEW_UNIVERSITY_COUNT).map((university) => ({
    id: university.id,
    koreanName: university.koreanName,
    homeUniversityName: university.homeUniversityName,
    region: university.region,
    country: university.country,
    logoImageUrl: university.logoImageUrl,
    languageRequirements: university.languageRequirements
      .slice(0, PREVIEW_LANGUAGE_REQUIREMENT_COUNT)
      .map(({ languageTestType, minScore }) => ({ languageTestType, minScore })),
  }));
};

export const getHomeUniversityPreviews = (allUniversities: ListUniversity[]): HomeUniversityPreviewList => {
  const previews: HomeUniversityPreviewList = {
    [RegionEnumExtend.ALL]: getPreviewUniversities(allUniversities),
  };

  for (const { name, shortName } of HOME_UNIVERSITY_LIST) {
    const universities = allUniversities.filter((university) =>
      isMatchedHomeUniversityName(university.homeUniversityName, name),
    );
    previews[shortName] = getPreviewUniversities(universities);
  }

  return previews;
};
