"use client";

import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import clsx from "clsx";
import { z } from "zod";

import CustomDropdown from "../CustomDropdown";

// --- 상수, 타입, 아이콘 등 ---
import {
  COUNTRY_CODE_MAP,
  LANGUAGE_TEST_TYPE_MAP,
  REGIONS_SEARCH,
  REGION_TO_COUNTRIES_MAP,
} from "@/constants/university";
import { CountryCode, LanguageTestType } from "@/types/university";

import { zodResolver } from "@hookform/resolvers/zod";

// --- 커스텀 드롭다운 컴포넌트 ---

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

  const { handleSubmit, control, watch, setValue } = useForm<SearchFormData>({
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
    router.push(`/university?${queryString}`);
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col">
      <div className="mb-6 flex space-x-2">
        {REGIONS_SEARCH.map((region) => (
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
              "min-w-fit whitespace-nowrap rounded-full border border-k-50 px-4 py-2 transition-colors",
              watchedRegions.includes(region) ? "border-primary bg-primary-100 text-primary-900" : "bg-k-50 text-k-300",
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
              value={field.value ?? ""}
              onChange={field.onChange}
              placeholder="어학"
              placeholderSelect="선택"
              placeholderIcon={
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15" fill="none">
                  <path
                    d="M14.4689 10.7092V5.97565L8.30622 9.48567C8.07656 9.61938 7.83413 9.68624 7.57895 9.68624C7.32377 9.68624 7.08134 9.61938 6.85168 9.48567L0.382782 5.79513C0.242431 5.7149 0.14342 5.61462 0.0857483 5.49427C0.0280769 5.37393 -0.000503651 5.24021 6.71535e-06 5.09313C0.000517082 4.94604 0.0293529 4.81233 0.0865139 4.69198C0.143675 4.57164 0.242431 4.47135 0.382782 4.39112L6.85168 0.700585C6.96651 0.633728 7.08466 0.583451 7.20613 0.549754C7.32759 0.516058 7.45187 0.499478 7.57895 0.500013C7.70603 0.500547 7.83056 0.517395 7.95254 0.550557C8.07451 0.583718 8.19241 0.633728 8.30622 0.700585L15.5981 4.8725C15.7257 4.93936 15.8247 5.03643 15.8951 5.16373C15.9655 5.29103 16.0005 5.42795 16 5.5745V10.7092C16 10.9365 15.9265 11.1272 15.7795 11.2812C15.6325 11.4352 15.4508 11.512 15.2344 11.5115C15.018 11.5109 14.8364 11.4339 14.6894 11.2804C14.5424 11.1269 14.4689 10.9365 14.4689 10.7092ZM6.85168 14.2994L3.02393 12.1332C2.76874 11.9861 2.57098 11.7856 2.43063 11.5315C2.29028 11.2775 2.2201 11.0033 2.2201 10.7092V7.66046L6.85168 10.288C7.08134 10.4217 7.32377 10.4885 7.57895 10.4885C7.83413 10.4885 8.07656 10.4217 8.30622 10.288L12.9378 7.66046V10.7092C12.9378 11.0033 12.8676 11.2775 12.7273 11.5315C12.5869 11.7856 12.3892 11.9861 12.134 12.1332L8.30622 14.2994C8.19139 14.3663 8.07349 14.4165 7.95254 14.4502C7.83158 14.4839 7.70705 14.5005 7.57895 14.5C7.45085 14.4995 7.32632 14.4829 7.20536 14.4502C7.0844 14.4176 6.96651 14.3673 6.85168 14.2994Z"
                    fill="currentColor"
                    className="text-k-100"
                  />
                </svg>
              }
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15" fill="none">
                  <path
                    d="M14.4689 10.7092V5.97565L8.30622 9.48567C8.07656 9.61938 7.83413 9.68624 7.57895 9.68624C7.32377 9.68624 7.08134 9.61938 6.85168 9.48567L0.382782 5.79513C0.242431 5.7149 0.14342 5.61462 0.0857483 5.49427C0.0280769 5.37393 -0.000503651 5.24021 6.71535e-06 5.09313C0.000517082 4.94604 0.0293529 4.81233 0.0865139 4.69198C0.143675 4.57164 0.242431 4.47135 0.382782 4.39112L6.85168 0.700585C6.96651 0.633728 7.08466 0.583451 7.20613 0.549754C7.32759 0.516058 7.45187 0.499478 7.57895 0.500013C7.70603 0.500547 7.83056 0.517395 7.95254 0.550557C8.07451 0.583718 8.19241 0.633728 8.30622 0.700585L15.5981 4.8725C15.7257 4.93936 15.8247 5.03643 15.8951 5.16373C15.9655 5.29103 16.0005 5.42795 16 5.5745V10.7092C16 10.9365 15.9265 11.1272 15.7795 11.2812C15.6325 11.4352 15.4508 11.512 15.2344 11.5115C15.018 11.5109 14.8364 11.4339 14.6894 11.2804C14.5424 11.1269 14.4689 10.9365 14.4689 10.7092ZM6.85168 14.2994L3.02393 12.1332C2.76874 11.9861 2.57098 11.7856 2.43063 11.5315C2.29028 11.2775 2.2201 11.0033 2.2201 10.7092V7.66046L6.85168 10.288C7.08134 10.4217 7.32377 10.4885 7.57895 10.4885C7.83413 10.4885 8.07656 10.4217 8.30622 10.288L12.9378 7.66046V10.7092C12.9378 11.0033 12.8676 11.2775 12.7273 11.5315C12.5869 11.7856 12.3892 11.9861 12.134 12.1332L8.30622 14.2994C8.19139 14.3663 8.07349 14.4165 7.95254 14.4502C7.83158 14.4839 7.70705 14.5005 7.57895 14.5C7.45085 14.4995 7.32632 14.4829 7.20536 14.4502C7.0844 14.4176 6.96651 14.3673 6.85168 14.2994Z"
                    fill="currentColor"
                    className="text-accent-custom-orange-light"
                  />
                </svg>
              }
              options={Object.entries(LANGUAGE_TEST_TYPE_MAP).map(([value, label]) => ({ value, label }))}
            />
          )}
        />

        {countrySelectsToRender.map((index) => {
          const name: "country1" | "country2" | "country3" = index === 1 ? "country1" : index === 2 ? "country2" : "country3";
          return (
            <Controller
              key={name}
              name={name}
              control={control}
              render={({ field }) => (
                <CustomDropdown
                  placeholderIcon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="17" viewBox="0 0 12 17" fill="none">
                      <path
                        d="M6 0.5C2.68286 0.5 0 3.004 0 6.1C0 10.3 6 16.5 6 16.5C6 16.5 12 10.3 12 6.1C12 3.004 9.31714 0.5 6 0.5ZM6 8.1C5.43168 8.1 4.88663 7.88929 4.48477 7.51421C4.08291 7.13914 3.85714 6.63043 3.85714 6.1C3.85714 5.56957 4.08291 5.06086 4.48477 4.68579C4.88663 4.31071 5.43168 4.1 6 4.1C6.56832 4.1 7.11337 4.31071 7.51523 4.68579C7.91709 5.06086 8.14286 5.56957 8.14286 6.1C8.14286 6.63043 7.91709 7.13914 7.51523 7.51421C7.11337 7.88929 6.56832 8.1 6 8.1Z"
                        fill="currentColor"
                        className="text-k-100"
                      />
                    </svg>
                  }
                  placeholderSelect="나라"
                  value={field.value ?? ""}
                  onChange={(value) => {
                    field.onChange(value);
                    if (!value) {
                      if (index === 1) setValue("country2", null);
                      if (index <= 2) setValue("country3", null);
                    }
                  }}
                  placeholder="관심있는 나라"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="17" viewBox="0 0 12 17" fill="none">
                      <path
                        d="M6 0.5C2.68286 0.5 0 3.004 0 6.1C0 10.3 6 16.5 6 16.5C6 16.5 12 10.3 12 6.1C12 3.004 9.31714 0.5 6 0.5ZM6 8.1C5.43168 8.1 4.88663 7.88929 4.48477 7.51421C4.08291 7.13914 3.85714 6.63043 3.85714 6.1C3.85714 5.56957 4.08291 5.06086 4.48477 4.68579C4.88663 4.31071 5.43168 4.1 6 4.1C6.56832 4.1 7.11337 4.31071 7.51523 4.68579C7.91709 5.06086 8.14286 5.56957 8.14286 6.1C8.14286 6.63043 7.91709 7.13914 7.51523 7.51421C7.11337 7.88929 6.56832 8.1 6 8.1Z"
                        fill="currentColor"
                        className="text-secondary"
                      />
                    </svg>
                  }
                  options={availableCountries
                    .filter(([code]) => !watchedCountries.includes(code as CountryCode) || code === field.value)
                    .map(([value, label]) => ({ value, label }))}
                />
              )}
            />
          );
        })}
      </div>
      <button
        type="submit"
        className="mt-10 rounded-lg bg-primary px-4 py-3 text-center text-white transition-colors typo-sb-9 hover:bg-primary-600"
      >
        학교 검색
      </button>
    </form>
  );
};

export default SchoolSearchForm;
