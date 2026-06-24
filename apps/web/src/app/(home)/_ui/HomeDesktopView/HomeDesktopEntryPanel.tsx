"use client";

import clsx from "clsx";
import Link from "next/link";

import CustomDropdown from "@/components/search/CustomDropdown";
import UniversityZoneLink from "@/components/ui/UniversityZoneLink";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { IconIdCard, IconMagnifyingGlass, IconMuseum, IconPaper } from "@/public/svgs/home";
import { IconHatColor, IconHatGray, IconLocationColor, IconLocationGray } from "@/public/svgs/search";
import useHomeUniversitySearch from "../HomeUniversitySearchSection/_hooks/useHomeUniversitySearch";

const actionLinks = [
  {
    href: "/university/search",
    label: "학교 검색하기",
    description: "조건에 맞는 파견학교 찾기",
    icon: IconMagnifyingGlass,
    colorClassName: "bg-bg-accent-blue text-secondary",
    isUniversityZone: true,
  },
  {
    href: "/university/score",
    label: "성적 입력하기",
    description: "내 점수로 합격선 확인",
    icon: IconPaper,
    colorClassName: "bg-bg-accent-sky text-sub-a",
    isUniversityZone: false,
  },
  {
    href: "/university/application/apply",
    label: "학교 지원하기",
    description: "희망 학교 지원서 작성",
    icon: IconMuseum,
    colorClassName: "bg-bg-accent-orange text-accent-custom-orange",
    isUniversityZone: false,
  },
  {
    href: "/university/application",
    label: "지원자 현황 확인",
    description: "현재 경쟁률 확인",
    icon: IconIdCard,
    colorClassName: "bg-bg-accent-green text-accent-custom-green",
    isUniversityZone: false,
  },
] as const;

const HomeDesktopEntryPanel = () => {
  const { isAuthenticated, isInitialized } = useAuthStore();
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
    searchHref,
  } = useHomeUniversitySearch();

  if (!isInitialized) {
    return (
      <div className="rounded-lg border border-k-100 bg-white p-6">
        <div className="h-7 w-36 animate-pulse rounded bg-k-100" />
        <div className="mt-5 grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-lg bg-k-50" />
          ))}
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <section className="rounded-lg border border-k-100 bg-white p-6">
        <div className="mb-5">
          <h2 className="text-k-900 typo-bold-4">빠른 실행</h2>
          <p className="mt-1 text-k-500 typo-medium-4">자주 쓰는 교환학생 업무를 바로 이어갈 수 있어요.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {actionLinks.map(({ href, label, description, icon: Icon, colorClassName, isUniversityZone }) => {
            const content = (
              <div
                key={href}
                className={clsx("flex h-full min-h-32 flex-col justify-between rounded-lg p-4", colorClassName)}
              >
                <div>
                  <span className="block typo-bold-5">{label}</span>
                  <span className="mt-1 block text-k-700 typo-medium-5">{description}</span>
                </div>
                <div className="flex justify-end">
                  <Icon />
                </div>
              </div>
            );

            return isUniversityZone ? (
              <UniversityZoneLink key={href} href={href} className="h-full transition-transform hover:-translate-y-0.5">
                {content}
              </UniversityZoneLink>
            ) : (
              <Link key={href} href={href} className="h-full transition-transform hover:-translate-y-0.5">
                {content}
              </Link>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-k-100 bg-white p-6">
      <div className="mb-5">
        <h2 className="text-k-900 typo-bold-4">파견학교 검색</h2>
        <p className="mt-1 text-k-500 typo-medium-4">소속 대학과 조건을 선택해 지원 가능한 학교를 찾아보세요.</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {homeUniversities.map((university) => {
          const isSelected = university.slug === selectedHomeUniversitySlug;

          return (
            <button
              key={university.slug}
              type="button"
              onClick={() => setSelectedHomeUniversitySlug(university.slug)}
              className={clsx(
                "min-w-0 rounded-full border px-4 py-2 transition-colors typo-medium-3",
                isSelected
                  ? "border-primary bg-primary-100 text-primary-900"
                  : "border-k-100 bg-k-50 text-k-500 hover:border-k-200 hover:bg-k-100",
              )}
              aria-pressed={isSelected}
            >
              {university.shortName}
            </button>
          );
        })}
      </div>

      <div className="grid gap-3">
        <CustomDropdown
          value={languageTestType}
          onChange={setLanguageTestType}
          placeholder="어학"
          placeholderSelect="선택"
          placeholderIcon={<IconHatGray />}
          icon={<IconHatColor />}
          options={languageOptions}
        />

        {countryOptionsByIndex.map((countryOptions, index) => (
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
        ))}

        <UniversityZoneLink
          href={searchHref}
          className="mt-2 w-full rounded-lg bg-primary px-4 py-4 text-center text-k-0 transition-colors typo-sb-8 hover:bg-primary-600"
        >
          학교 검색하기
        </UniversityZoneLink>
      </div>
    </section>
  );
};

export default HomeDesktopEntryPanel;
