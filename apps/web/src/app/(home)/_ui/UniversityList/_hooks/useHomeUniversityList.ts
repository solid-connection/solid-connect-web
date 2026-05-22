import { type Dispatch, type SetStateAction, useMemo, useState } from "react";

import { HOME_UNIVERSITY_LIST, isMatchedHomeUniversityName } from "@/constants/university";
import { type AllRegionsUniversityList, type ListUniversity, RegionEnumExtend } from "@/types/university";

const ALL_HOME_UNIVERSITY_CHOICE = "전체";
const PREVIEW_UNIVERSITY_COUNT = 3;

const useHomeUniversityList = (allRegionsUniversityList: AllRegionsUniversityList) => {
  const [selectedHomeUniversity, setSelectedHomeUniversity] = useState<string | null>(ALL_HOME_UNIVERSITY_CHOICE);
  const handleHomeUniversityChange: Dispatch<SetStateAction<string | null>> = (nextHomeUniversity) => {
    setSelectedHomeUniversity((prevHomeUniversity) => {
      const resolvedHomeUniversity =
        typeof nextHomeUniversity === "function" ? nextHomeUniversity(prevHomeUniversity) : nextHomeUniversity;

      return resolvedHomeUniversity ?? ALL_HOME_UNIVERSITY_CHOICE;
    });
  };
  const homeUniversityChoices = useMemo(
    () => [ALL_HOME_UNIVERSITY_CHOICE, ...HOME_UNIVERSITY_LIST.map((university) => university.shortName)],
    [],
  );

  const allUniversities = allRegionsUniversityList[RegionEnumExtend.ALL] ?? [];
  const selectedUniversityInfo = useMemo(
    () => HOME_UNIVERSITY_LIST.find((university) => university.shortName === selectedHomeUniversity),
    [selectedHomeUniversity],
  );

  const universities: ListUniversity[] = useMemo(() => {
    if (!selectedUniversityInfo) return allUniversities;

    return allUniversities.filter((university) =>
      isMatchedHomeUniversityName(university.homeUniversityName, selectedUniversityInfo.name),
    );
  }, [allUniversities, selectedUniversityInfo]);

  const previewUniversities = useMemo(() => universities.slice(0, PREVIEW_UNIVERSITY_COUNT), [universities]);
  const moreHref = selectedUniversityInfo ? `/university/${selectedUniversityInfo.slug}` : "/university";

  return {
    selectedHomeUniversity,
    setSelectedHomeUniversity: handleHomeUniversityChange,
    homeUniversityChoices,
    previewUniversities,
    moreHref,
  };
};

export default useHomeUniversityList;
