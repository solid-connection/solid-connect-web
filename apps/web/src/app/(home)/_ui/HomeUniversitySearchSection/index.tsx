"use client";

import clsx from "clsx";

import CustomDropdown from "@/components/search/CustomDropdown";
import { IconHatColor, IconHatGray, IconLocationColor, IconLocationGray } from "@/public/svgs/search";
import useHomeUniversitySearch from "./_hooks/useHomeUniversitySearch";

const HomeUniversitySearchSection = () => {
  const {
    homeUniversities,
    selectedHomeUniversitySlug,
    setSelectedHomeUniversitySlug,
    languageTestType,
    setLanguageTestType,
    countries,
    languageOptions,
    countryOptionsByIndex,
    handleCountryChange,
    submitSearch,
  } = useHomeUniversitySearch();

  return (
    <section className="px-5 py-5">
      <h2 className="mb-4 text-k-900 typo-bold-1">파견 학교 찾기</h2>

      <div className="mb-3 flex gap-2 overflow-x-auto">
        {homeUniversities.map((university) => {
          const isSelected = university.slug === selectedHomeUniversitySlug;

          return (
            <button
              key={university.slug}
              type="button"
              onClick={() => setSelectedHomeUniversitySlug(university.slug)}
              className={clsx(
                "min-w-fit whitespace-nowrap rounded-full border px-4 py-2 transition-colors typo-medium-2",
                isSelected
                  ? "border-primary bg-primary-100 text-primary-900"
                  : "border-k-50 bg-k-50 text-k-300 hover:border-k-100 hover:bg-k-100",
              )}
              aria-pressed={isSelected}
            >
              {university.shortName}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        <CustomDropdown
          value={languageTestType}
          onChange={setLanguageTestType}
          placeholder="어학"
          placeholderSelect="선택"
          placeholderIcon={<IconHatGray />}
          icon={<IconHatColor />}
          options={languageOptions}
        />

        {countryOptionsByIndex.map((countryOptions, index) => {
          return (
            <CustomDropdown
              key={index}
              value={countries[index]}
              onChange={(value) => handleCountryChange(index, value)}
              placeholder="관심있는 나라"
              placeholderSelect="나라"
              placeholderIcon={<IconLocationGray />}
              icon={<IconLocationColor />}
              options={countryOptions}
            />
          );
        })}
      </div>

      <button
        type="button"
        onClick={submitSearch}
        className="mt-3 w-full rounded-lg bg-primary px-4 py-4 text-center text-k-0 transition-colors typo-sb-9 hover:bg-primary-600"
      >
        학교 검색하기
      </button>
    </section>
  );
};

export default HomeUniversitySearchSection;
