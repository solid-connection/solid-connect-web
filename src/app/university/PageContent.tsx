"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import clsx from "clsx";
import { z } from "zod";

import SearchBar from "./SearchBar";

// --- 상수, 타입, 아이콘 등 ---
import { COUNTRY_CODE_MAP, LANGUAGE_TEST_TYPE_MAP, REGIONS_KO, REGION_TO_COUNTRIES_MAP } from "@/constants/university";
import { CountryCode, LanguageTestType } from "@/types/university";

import { zodResolver } from "@hookform/resolvers/zod";

// --- 아이콘 컴포넌트 (임시) ---
const SearchIcon = () => (
  <svg fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
      clipRule="evenodd"
    ></path>
  </svg>
);
const ChevronDownIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
      clipRule="evenodd"
    />
  </svg>
);
const LanguageIcon = () => <span className="text-orange-400">📙</span>;
const CountryIcon = () => <span className="text-blue-500">📍</span>;

// --- 외부 클릭 감지 Hook ---
const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

// --- 커스텀 드롭다운 컴포넌트 ---
const CustomDropdown = ({ options, value, onChange, placeholder, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, () => setIsOpen(false));
  const selectedOptionLabel = useMemo(() => options.find((opt) => opt.value === value)?.label, [options, value]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "flex w-full items-center rounded-lg border p-3.5 text-left transition-colors",
          isOpen ? "border-purple-500 bg-white" : "border-gray-200 bg-white",
        )}
      >
        {icon && <span className="mr-3">{icon}</span>}
        <span className={clsx("flex-1", selectedOptionLabel ? "text-gray-800" : "text-gray-500")}>
          {selectedOptionLabel || placeholder}
        </span>
        <span className={clsx("text-purple-600 transition-transform", isOpen && "rotate-180")}>
          <ChevronDownIcon />
        </span>
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">
          <ul>
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={clsx(
                    "w-full px-4 py-2.5 text-left text-gray-700 hover:bg-purple-50",
                    option.value === value && "bg-purple-100 font-semibold text-purple-700",
                  )}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// --- Zod 스키마 및 타입 정의 ---
const searchSchema = z.object({
  searchText: z.string().optional(),
  regions: z.array(z.string()).optional(),
  languageTestType: z.union([z.nativeEnum(LanguageTestType), z.literal(""), z.null()]).optional(),
  country1: z.union([z.nativeEnum(CountryCode), z.literal(""), z.null()]).optional(),
  country2: z.union([z.nativeEnum(CountryCode), z.literal(""), z.null()]).optional(),
  country3: z.union([z.nativeEnum(CountryCode), z.literal(""), z.null()]).optional(),
});
type SearchFormData = z.infer<typeof searchSchema>;

// --- 메인 폼 컴포넌트 ---
const SchoolSearchForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: { regions: [] },
  });

  const watchedRegions = watch("regions") || [];
  const watchedCountries = watch(["country1", "country2", "country3"]);

  const onSubmit: SubmitHandler<SearchFormData> = (data) => {
    const queryParams = new URLSearchParams();

    if (data.searchText) {
      queryParams.append("searchText", data.searchText);
    }
    if (data.languageTestType) {
      queryParams.append("languageTestType", data.languageTestType);
    }

    [data.country1, data.country2, data.country3].forEach((code) => {
      if (code) {
        queryParams.append("countryCode", code);
      }
    });

    const queryString = queryParams.toString();
    router.push(`/university/search-results?${queryString}`);
  };

  const availableCountries = useMemo(() => {
    if (watchedRegions.length === 0) return Object.entries(COUNTRY_CODE_MAP);
    const countrySet = new Set<string>();
    watchedRegions.forEach((region) => REGION_TO_COUNTRIES_MAP[region]?.forEach((country) => countrySet.add(country)));
    return Object.entries(COUNTRY_CODE_MAP).filter(([_, name]) => countrySet.has(name));
  }, [watchedRegions]);

  const countrySelectsToRender = useMemo(() => {
    const count = 1 + (watchedCountries[0] ? 1 : 0) + (watchedCountries[1] ? 1 : 0);
    return Array.from({ length: Math.min(count, 3) }, (_, i) => i + 1);
  }, [watchedCountries]);

  return (
    <main className="flex flex-1 flex-col overflow-y-auto bg-white p-5">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col">
        <div className="flex-1">
          <h2 className="mb-1 text-2xl font-bold">오직 나를 위한</h2>
          <h2 className="mb-6 text-2xl font-bold">맞춤 파견 학교 찾기</h2>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="해외 파견 학교를 검색하세요."
              className="w-full rounded-lg border border-gray-200 bg-white p-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-400"
              {...register("searchText")}
            />
            <div className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400">
              <SearchIcon />
            </div>
          </div>
          <div className="mb-6 flex space-x-2">
            {REGIONS_KO.map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => {
                  const currentRegions = watch("regions") || [];
                  const newRegions = currentRegions.includes(region)
                    ? currentRegions.filter((r) => r !== region)
                    : [...currentRegions, region];
                  setValue("regions", newRegions, { shouldValidate: true });
                }}
                className={clsx(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  watchedRegions.includes(region)
                    ? "border-purple-500 bg-purple-100 text-purple-600"
                    : "border-gray-300 bg-white text-gray-500",
                )}
              >
                {region}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            <Controller
              name="languageTestType"
              control={control}
              render={({ field }) => (
                <CustomDropdown
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="어학"
                  icon={<LanguageIcon />}
                  options={Object.entries(LANGUAGE_TEST_TYPE_MAP).map(([value, label]) => ({ value, label }))}
                />
              )}
            />

            {countrySelectsToRender.map((index) => {
              const name = `country${index}` as const;
              return (
                <Controller
                  key={name}
                  name={name}
                  control={control}
                  render={({ field }) => (
                    <CustomDropdown
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        if (!value) {
                          if (index === 1) setValue("country2", null);
                          if (index <= 2) setValue("country3", null);
                        }
                      }}
                      placeholder="관심있는 나라"
                      icon={<CountryIcon />}
                      options={availableCountries
                        .filter(([code]) => !watchedCountries.includes(code as CountryCode) || code === field.value)
                        .map(([value, label]) => ({ value, label }))}
                    />
                  )}
                />
              );
            })}
          </div>
        </div>
        <SearchBar name="searchText" register={register} placeholder="해외 파견 학교를 검색하세요." />
      </form>
    </main>
  );
};

export default SchoolSearchForm;
