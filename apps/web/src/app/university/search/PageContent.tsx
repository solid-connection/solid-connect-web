"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import CustomDropdown from "@/components/search/CustomDropdown";
import { REGIONS_SEARCH } from "@/constants/university";
import { IconHatColor, IconHatGray, IconLocationColor, IconLocationGray } from "@/public/svgs/search";
import { CountryCode, type HomeUniversitySlug, LanguageTestType } from "@/types/university";
import {
  buildUniversitySearchQuery,
  getAvailableCountryOptionsByRegions,
  getCountryOptions,
  getLanguageTestOptions,
  getVisibleCountrySelectIndexes,
} from "@/utils/universitySearchQuery";

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

interface SchoolSearchFormProps {
  homeUniversitySlug: HomeUniversitySlug;
}

// --- 메인 폼 컴포넌트 ---
const SchoolSearchForm = ({ homeUniversitySlug }: SchoolSearchFormProps) => {
  const router = useRouter();

  const { handleSubmit, control, watch, setValue } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: { regions: [] },
  });

  const watchedRegions = watch("regions") || [];
  const watchedCountries = watch(["country1", "country2", "country3"]);

  const onSubmit: SubmitHandler<SearchFormData> = (data) => {
    const queryString = buildUniversitySearchQuery({
      searchText: data.searchText,
      languageTestType: data.languageTestType,
      countryCodes: [data.country1, data.country2, data.country3],
      regions: data.regions,
      availableCountryCodes: availableCountries.map(([code]) => code),
    }).toString();

    router.push(`/university/${homeUniversitySlug}?${queryString}`);
  };

  const availableCountries = useMemo(() => getAvailableCountryOptionsByRegions(watchedRegions), [watchedRegions]);
  const countrySelectsToRender = useMemo(() => getVisibleCountrySelectIndexes(watchedCountries), [watchedCountries]);

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
              placeholderIcon={<IconHatGray />}
              icon={<IconHatColor />}
              options={getLanguageTestOptions()}
            />
          )}
        />

        {countrySelectsToRender.map((index) => {
          const name: "country1" | "country2" | "country3" =
            index === 1 ? "country1" : index === 2 ? "country2" : "country3";
          return (
            <Controller
              key={name}
              name={name}
              control={control}
              render={({ field }) => (
                <CustomDropdown
                  placeholderIcon={<IconLocationGray />}
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
                  icon={<IconLocationColor />}
                  options={getCountryOptions(
                    watchedCountries.map((country) => country ?? ""),
                    index - 1,
                    availableCountries,
                  )}
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
