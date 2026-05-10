import { COUNTRY_CODE_MAP, LANGUAGE_TEST_TYPE_MAP } from "@/constants/university";

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

  countryCodes.forEach((code) => {
    if (code && (!availableCountryCodeSet || availableCountryCodeSet.has(code))) {
      queryParams.append("countryCode", code);
    }
  });

  regions.forEach((region) => queryParams.append("region", region));

  return queryParams;
};
