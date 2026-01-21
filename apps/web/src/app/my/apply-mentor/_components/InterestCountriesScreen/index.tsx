"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";

import clsx from "clsx";

import BlockBtn from "@/components/button/BlockBtn";

import { MentorApplicationFormData } from "../../_lib/schema";

import { mentorRegionList } from "@/constants/regions";

type InterestCountriesScreenProps = {
  onNext: () => void;
};

const InterestCountriesScreen = ({ onNext }: InterestCountriesScreenProps) => {
  const {
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<MentorApplicationFormData>();

  const [selectedRegion, setSelectedRegion] = useState<string>("미주권");
  const selectedCountries = watch("interestedCountries") || [];

  const handleNext = async () => {
    const isValid = await trigger("interestedCountries");
    if (isValid) {
      onNext();
    }
  };

  const removeCountry = (country: string) => {
    setValue(
      "interestedCountries",
      selectedCountries.filter((c) => c !== country),
    );
  };

  const toggleCountry = (country: string) => {
    if (selectedCountries.includes(country)) {
      setValue(
        "interestedCountries",
        selectedCountries.filter((c) => c !== country),
      );
    } else {
      setValue("interestedCountries", [...selectedCountries, country]);
    }
  };

  const currentRegion = mentorRegionList.find((r) => r.name === selectedRegion);

  return (
    <div className="pb-28">
      <div className="px-5">
        <div className="mt-5">
          <span className="text-k-900 typo-bold-1">
            나의
            <span className="text-primary"> 수학 국가</span>를
            <br />
            선택해주세요
          </span>
        </div>

        {/* Selected Countries Tags */}
        {selectedCountries.length > 0 && (
          <div className="mt-5 grid grid-cols-3 gap-3">
            {selectedCountries.map((country) => (
              <button
                key={country}
                className="relative h-10 rounded bg-primary-100 text-center text-k-800 typo-medium-2"
                onClick={() => removeCountry(country)}
                type="button"
              >
                {country}
                <span className="absolute right-0 top-0 p-1 leading-none">✕</span>
              </button>
            ))}
          </div>
        )}

        {/* Error Message */}
        {errors.interestedCountries && (
          <p className="mt-2 text-red-500 typo-regular-2">{errors.interestedCountries.message}</p>
        )}

        {/* Region Tabs - Large Icon Buttons */}
        <div className="mt-10 grid grid-cols-3 gap-4">
          {mentorRegionList.map((region) => (
            <button
              key={region.name}
              type="button"
              onClick={() => setSelectedRegion(region.name)}
              className={clsx(
                "flex h-20 flex-col items-center justify-center gap-2 rounded-xl border-2 transition-all",
                {
                  "bg-primary-50 border-primary": selectedRegion === region.name,
                  "border-k-100 bg-white": selectedRegion !== region.name,
                },
              )}
            >
              <div className="flex h-12 w-12 items-center justify-center">{region.icon}</div>
              <span
                className={clsx("text-center typo-sb-9", {
                  "text-primary": selectedRegion === region.name,
                  "text-k-700": selectedRegion !== region.name,
                })}
              >
                {region.name}
              </span>
            </button>
          ))}
        </div>

        {/* Country Buttons - Only show current region's countries */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {currentRegion?.countries.map((country) => (
            <button
              key={country}
              className={clsx("h-10 rounded border-none transition-colors typo-medium-2", {
                "bg-k-50 text-k-600 hover:bg-k-100": !selectedCountries.includes(country),
                "bg-primary-100 text-k-800": selectedCountries.includes(country),
              })}
              onClick={() => toggleCountry(country)}
              type="button"
            >
              {country}
            </button>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 w-full bg-white pb-14">
        <div className="mx-auto w-full max-w-app px-5">
          <BlockBtn className="mb-[29px]" disabled={selectedCountries.length === 0} onClick={handleNext}>
            다음
          </BlockBtn>
        </div>
      </div>
    </div>
  );
};

export default InterestCountriesScreen;
