"use client";

import clsx from "clsx";
import { useState } from "react";
import { HOME_UNIVERSITY_LIST, HOME_UNIVERSITY_TO_SLUG_MAP } from "@/constants/university";
import { HomeUniversity, type HomeUniversitySlug } from "@/types/university";
import SchoolSearchForm, { DesktopSchoolSearchForm } from "./PageContent";
import SearchBar, { DesktopSearchBar } from "./SearchBar";

const SearchClientContent = () => {
  const [selectedHomeUniversitySlug, setSelectedHomeUniversitySlug] = useState<HomeUniversitySlug>(
    HOME_UNIVERSITY_TO_SLUG_MAP[HomeUniversity.INHA],
  );

  return (
    <>
      <MobileHomeUniversitySelector
        selectedHomeUniversitySlug={selectedHomeUniversitySlug}
        setSelectedHomeUniversitySlug={setSelectedHomeUniversitySlug}
      />

      <div className="relative mb-4">
        <SearchBar homeUniversitySlug={selectedHomeUniversitySlug} />
      </div>

      <SchoolSearchForm homeUniversitySlug={selectedHomeUniversitySlug} />
    </>
  );
};

export const SearchDesktopContent = () => {
  const [selectedHomeUniversitySlug, setSelectedHomeUniversitySlug] = useState<HomeUniversitySlug>(
    HOME_UNIVERSITY_TO_SLUG_MAP[HomeUniversity.INHA],
  );

  return (
    <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(280px,340px)]">
      <section className="rounded-lg border border-k-100 bg-white p-6">
        <h2 className="text-k-900 typo-bold-4">검색 조건</h2>
        <p className="mt-1 text-k-500 typo-medium-3">학교명, 지역, 국가, 어학 조건을 조합해서 찾아보세요.</p>
        <div className="mt-6">
          <DesktopSearchBar homeUniversitySlug={selectedHomeUniversitySlug} />
        </div>
        <div className="mt-6">
          <DesktopSchoolSearchForm homeUniversitySlug={selectedHomeUniversitySlug} />
        </div>
      </section>

      <aside className="desktop-sticky-panel rounded-lg border border-k-100 bg-white p-6">
        <h2 className="text-k-900 typo-bold-4">소속 학교</h2>
        <p className="mt-2 text-k-500 typo-medium-3">선택한 학교 기준으로 검색 결과가 제공됩니다.</p>
        <div className="mt-5">
          <DesktopHomeUniversitySelector
            selectedHomeUniversitySlug={selectedHomeUniversitySlug}
            setSelectedHomeUniversitySlug={setSelectedHomeUniversitySlug}
          />
        </div>
      </aside>
    </div>
  );
};

type HomeUniversitySelectorProps = {
  selectedHomeUniversitySlug: HomeUniversitySlug;
  setSelectedHomeUniversitySlug: (slug: HomeUniversitySlug) => void;
};

const MobileHomeUniversitySelector = ({
  selectedHomeUniversitySlug,
  setSelectedHomeUniversitySlug,
}: HomeUniversitySelectorProps) => {
  return (
    <div className="mb-4 flex gap-2 overflow-x-auto">
      {HOME_UNIVERSITY_LIST.map((university) => {
        const isSelected = university.slug === selectedHomeUniversitySlug;

        return (
          <button
            key={university.slug}
            type="button"
            onClick={() => setSelectedHomeUniversitySlug(university.slug)}
            className={clsx(
              "min-w-fit whitespace-nowrap border transition-colors",
              "rounded-full px-4 py-2",
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
  );
};

const DesktopHomeUniversitySelector = ({
  selectedHomeUniversitySlug,
  setSelectedHomeUniversitySlug,
}: HomeUniversitySelectorProps) => {
  return (
    <div className="grid gap-2">
      {HOME_UNIVERSITY_LIST.map((university) => {
        const isSelected = university.slug === selectedHomeUniversitySlug;

        return (
          <button
            key={university.slug}
            type="button"
            onClick={() => setSelectedHomeUniversitySlug(university.slug)}
            className={clsx(
              "min-w-fit whitespace-nowrap rounded-lg border px-4 py-3 text-left transition-colors",
              isSelected
                ? "border-primary bg-primary-100 text-primary-900"
                : "border-k-50 bg-k-50 text-k-300 hover:border-k-100 hover:bg-k-100",
            )}
            aria-pressed={isSelected}
          >
            <span className="block typo-sb-9">{university.shortName}</span>
            <span className="mt-1 block typo-medium-4">{university.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default SearchClientContent;
