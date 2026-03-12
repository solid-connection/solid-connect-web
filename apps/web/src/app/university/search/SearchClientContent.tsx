"use client";

import clsx from "clsx";
import { useState } from "react";
import { HOME_UNIVERSITY_LIST, HOME_UNIVERSITY_TO_SLUG_MAP } from "@/constants/university";
import { HomeUniversity, type HomeUniversitySlug } from "@/types/university";
import SchoolSearchForm from "./PageContent";
import SearchBar from "./SearchBar";

const SearchClientContent = () => {
  const [selectedHomeUniversitySlug, setSelectedHomeUniversitySlug] = useState<HomeUniversitySlug>(
    HOME_UNIVERSITY_TO_SLUG_MAP[HomeUniversity.INHA],
  );

  return (
    <>
      <div className="mb-4 flex gap-2 overflow-x-auto">
        {HOME_UNIVERSITY_LIST.map((university) => {
          const isSelected = university.slug === selectedHomeUniversitySlug;

          return (
            <button
              key={university.slug}
              type="button"
              onClick={() => setSelectedHomeUniversitySlug(university.slug)}
              className={clsx(
                "min-w-fit whitespace-nowrap rounded-full border px-4 py-2 transition-colors",
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

      <div className="relative mb-4">
        <SearchBar homeUniversitySlug={selectedHomeUniversitySlug} />
      </div>

      <SchoolSearchForm homeUniversitySlug={selectedHomeUniversitySlug} />
    </>
  );
};

export default SearchClientContent;
