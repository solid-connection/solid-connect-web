import { COUNTRY_CODE_MAP, LANGUAGE_TEST_TYPE_MAP, REGION_TO_COUNTRIES_MAP } from "@/constants/university";

type CountryOptionEntry = [string, string];

interface BuildUniversitySearchQueryParams {
  searchText?: string | null;
  languageTestType?: string | null;
  countryCodes?: Array<string | null | undefined>;
  regions?: string[];
  availableCountryCodes?: string[];
}

interface GetCountryOptionsByIndexParams {
  countries: string[];
  visibleCount: number;
  availableCountries?: CountryOptionEntry[];
}

export const getLanguageTestOptions = () =>
  Object.entries(LANGUAGE_TEST_TYPE_MAP).map(([value, label]) => ({
    value,
    label,
  }));

export const getCountryOptions = (
  selectedCountries: string[],
  currentIndex: number,
  availableCountries: CountryOptionEntry[] = Object.entries(COUNTRY_CODE_MAP),
) => {
  const selectedCountrySet = new Set(
    selectedCountries.filter((country, countryIndex) => country && countryIndex !== currentIndex),
  );

  return availableCountries
    .filter(([code]) => !selectedCountrySet.has(code))
    .map(([value, label]) => ({ value, label }));
};

export const getCountryOptionsByIndex = ({
  countries,
  visibleCount,
  availableCountries = Object.entries(COUNTRY_CODE_MAP),
}: GetCountryOptionsByIndexParams) =>
  Array.from({ length: visibleCount }, (_, index) => getCountryOptions(countries, index, availableCountries));

export const getAvailableCountryOptionsByRegions = (regions: string[]) => {
  if (regions.length === 0) return Object.entries(COUNTRY_CODE_MAP);

  const countrySet = new Set<string>();
  regions.forEach((region) => REGION_TO_COUNTRIES_MAP[region]?.forEach((country) => countrySet.add(country)));

  return Object.entries(COUNTRY_CODE_MAP).filter(([, countryName]) => countrySet.has(countryName));
};

export const getVisibleCountrySelectIndexes = (countries: Array<string | null | undefined>, maxCount = 3) => {
  const visibleCount = 1 + Number(Boolean(countries[0])) + Number(Boolean(countries[1]));

  return Array.from({ length: Math.min(visibleCount, maxCount) }, (_, index) => index + 1);
};

export const buildUniversitySearchQuery = ({
  searchText,
  languageTestType,
  countryCodes = [],
  regions = [],
  availableCountryCodes,
}: BuildUniversitySearchQueryParams) => {
  const queryParams = new URLSearchParams();
  const trimmedSearchText = searchText?.trim();
  const availableCountryCodeSet = availableCountryCodes ? new Set(availableCountryCodes) : null;

  if (trimmedSearchText) {
    queryParams.append("searchText", trimmedSearchText);
  }

  if (languageTestType) {
    queryParams.append("languageTestType", languageTestType);
  }

  const appendedCountryCodes = new Set<string>();
  countryCodes.forEach((code) => {
    if (code && !appendedCountryCodes.has(code) && (!availableCountryCodeSet || availableCountryCodeSet.has(code))) {
      queryParams.append("countryCode", code);
      appendedCountryCodes.add(code);
    }
  });

  regions.forEach((region) => queryParams.append("region", region));

  return queryParams;
};
