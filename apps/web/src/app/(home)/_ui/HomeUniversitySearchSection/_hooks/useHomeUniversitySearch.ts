import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { HOME_UNIVERSITY_LIST } from "@/constants/university";
import type { HomeUniversitySlug } from "@/types/university";
import {
  buildUniversitySearchQuery,
  getCountryOptionsByIndex,
  getLanguageTestOptions,
  getVisibleCountrySelectIndexes,
} from "@/utils/universitySearchQuery";

const MAX_COUNTRY_SELECT_COUNT = 3;

const createEmptyCountries = () => Array<string>(MAX_COUNTRY_SELECT_COUNT).fill("");

const useHomeUniversitySearch = () => {
  const router = useRouter();
  const [selectedHomeUniversitySlug, setSelectedHomeUniversitySlug] = useState<HomeUniversitySlug>(
    HOME_UNIVERSITY_LIST[0].slug,
  );
  const [languageTestType, setLanguageTestType] = useState("");
  const [countries, setCountries] = useState<string[]>(createEmptyCountries);

  const languageOptions = useMemo(() => getLanguageTestOptions(), []);

  const visibleCountryCount = useMemo(() => {
    return getVisibleCountrySelectIndexes(countries, MAX_COUNTRY_SELECT_COUNT).length;
  }, [countries]);

  const countryOptionsByIndex = useMemo(
    () => getCountryOptionsByIndex({ countries, visibleCount: visibleCountryCount }),
    [countries, visibleCountryCount],
  );

  const handleCountryChange = (index: number, value: string) => {
    setCountries((prevCountries) =>
      prevCountries.map((country, countryIndex) => {
        if (countryIndex < index) return country;
        if (countryIndex === index) return value;
        return value ? country : "";
      }),
    );
  };

  const submitSearch = () => {
    const queryString = buildUniversitySearchQuery({
      languageTestType,
      countryCodes: countries,
    }).toString();

    router.push(`/university/${selectedHomeUniversitySlug}${queryString ? `?${queryString}` : ""}`);
  };

  return {
    homeUniversities: HOME_UNIVERSITY_LIST,
    selectedHomeUniversitySlug,
    setSelectedHomeUniversitySlug,
    languageTestType,
    setLanguageTestType,
    countries,
    languageOptions,
    countryOptionsByIndex,
    handleCountryChange,
    submitSearch,
  };
};

export default useHomeUniversitySearch;
