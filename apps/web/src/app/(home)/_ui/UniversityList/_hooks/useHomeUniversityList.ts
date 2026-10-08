import { type Dispatch, type SetStateAction, useMemo, useState } from "react";

import { HOME_UNIVERSITY_LIST } from "@/constants/university";
import { RegionEnumExtend } from "@/types/university";
import type { HomeUniversityPreviewList } from "../types";

const ALL_HOME_UNIVERSITY_CHOICE = RegionEnumExtend.ALL;

const useHomeUniversityList = (homeUniversityPreviews: HomeUniversityPreviewList) => {
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

  const selectedUniversityInfo = useMemo(
    () => HOME_UNIVERSITY_LIST.find((university) => university.shortName === selectedHomeUniversity),
    [selectedHomeUniversity],
  );

  const previewUniversities =
    homeUniversityPreviews[selectedUniversityInfo?.shortName ?? ALL_HOME_UNIVERSITY_CHOICE] ?? [];
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
