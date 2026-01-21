"use client";

import { useMemo, useRef } from "react";
import { useFormContext } from "react-hook-form";

import clsx from "clsx";

import BlockBtn from "@/components/button/BlockBtn";

import { MentorApplicationFormData } from "../../_lib/schema";

import { mentorRegionList } from "@/constants/regions";

import { useUniversitySearch } from "@/apis/universities";
import { toast } from "@/lib/zustand/useToastStore";

type UniversityScreenProps = {
  onNext: () => void;
};

const UniversityScreen = ({ onNext }: UniversityScreenProps) => {
  const {
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<MentorApplicationFormData>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const country = watch("country");
  const universityName = watch("universityName");
  const verificationFile = watch("verificationFile");

  // 모든 대학 목록 가져오기
  const { data: allUniversities = [], isLoading } = useUniversitySearch("");

  // regionList에서 모든 국가 추출 (중복 제거)
  const availableCountries = useMemo(() => {
    const countries = new Set<string>();
    mentorRegionList.forEach((region) => {
      region.countries.forEach((country) => countries.add(country));
    });
    return Array.from(countries).sort();
  }, []);

  // 선택된 국가에 따라 대학 목록 필터링
  const filteredUniversities = useMemo(() => {
    if (!country || !allUniversities) return [];
    return allUniversities.filter((uni) => uni.country === country);
  }, [country, allUniversities]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 형식 체크 (png, jpg, pdf)
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setValue("verificationFile", null as any);
      toast.error("파일 형식은 png, jpg, pdf만 허용됩니다.");
      return;
    }

    // 파일 크기 체크 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setValue("verificationFile", null as any);
      toast.error("파일 크기는 10MB 이하여야 합니다.");
      return;
    }

    setValue("verificationFile", file);
  };

  const handleRemoveFile = () => {
    setValue("verificationFile", null as any);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleNext = async () => {
    const isValid = await trigger(["country", "universityName", "verificationFile"]);
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="pb-28">
      <div className="px-5">
        <div className="mt-5">
          <span className="text-k-900 typo-bold-1">
            나의
            <span className="text-primary"> 수학 학교</span>를
            <br />
            선택해주세요
          </span>
        </div>

        <div className="mt-10 flex flex-col gap-5">
          {/* 국가 선택 */}
          <div className="flex flex-col gap-2">
            <label className="text-k-900 typo-sb-9">국가</label>
            <select
              value={country || ""}
              onChange={(e) => {
                setValue("country", e.target.value);
                setValue("universityName", ""); // 국가 변경 시 학교 선택 초기화
              }}
              className={clsx(
                "h-12 rounded-lg border border-k-200 bg-k-50 px-4 typo-regular-2 focus:border-primary focus:outline-none [&>option:checked]:text-primary",
                country && "text-accent-custom-indigo",
              )}
            >
              <option value="" className="text-k-400">
                국가를 선택해주세요
              </option>
              {availableCountries.map((countryName) => (
                <option key={countryName} value={countryName} className="text-primary">
                  {countryName}
                </option>
              ))}
            </select>
            {errors.country && <p className="text-red-500 typo-regular-2">{errors.country.message}</p>}
          </div>

          {/* 학교 선택 */}
          <div className="flex flex-col gap-2">
            <label className="text-k-900 typo-sb-9">학교</label>
            {isLoading ? (
              <div className="flex h-12 items-center justify-center rounded-lg border border-k-200 bg-k-50 px-4 text-k-400 typo-regular-2">
                학교 목록을 불러오는 중...
              </div>
            ) : (
              <select
                value={universityName || ""}
                onChange={(e) => setValue("universityName", e.target.value)}
                disabled={!country || filteredUniversities.length === 0}
                className={clsx(
                  "h-12 rounded-lg border border-k-200 bg-k-50 px-4 typo-regular-2 focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 [&>option:checked]:text-primary",
                  universityName && "text-accent-custom-indigo",
                )}
              >
                <option value="" className="text-k-400">
                  {!country
                    ? "먼저 국가를 선택해주세요"
                    : filteredUniversities.length === 0
                      ? "해당 국가에 등록된 학교가 없습니다"
                      : "학교를 선택해주세요"}
                </option>
                {filteredUniversities.map((university) => (
                  <option key={university.id} value={university.koreanName} className="text-primary">
                    {university.koreanName}
                  </option>
                ))}
              </select>
            )}
            {errors.universityName && <p className="text-red-500 typo-regular-2">{errors.universityName.message}</p>}
          </div>

          {/* 증명서 첨부 */}
          <div className="flex flex-col gap-2">
            <label className="text-k-900 typo-sb-9">증명서 첨부</label>
            <div className="rounded-lg border border-k-200 bg-k-50 p-4">
              {verificationFile ? (
                <div className="flex items-center justify-between">
                  <span className="text-primary typo-regular-2">{verificationFile.name}</span>
                  <button onClick={handleRemoveFile} type="button" className="text-k-400 hover:text-k-600">
                    <span className="typo-sb-5">✕</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                  className="w-full text-left text-k-400 typo-regular-2"
                >
                  파일을 선택해주세요
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
              />
            </div>
            {errors.verificationFile && (
              <p className="text-red-500 typo-regular-2">{errors.verificationFile.message}</p>
            )}

            {/* 증명서 안내 */}
            <div className="mt-2 rounded-lg bg-k-50 p-4">
              <h4 className="mb-2 text-k-700 typo-sb-9">[증명서 예시]</h4>
              <ul className="list-inside list-disc space-y-1 text-k-500 typo-regular-5">
                <li>
                  합격증, 재학증명서 등 해당 해외 대학교에 재적 중인 사실을 증명할 수 있는 이미지나 서류를 첨부해
                  주세요.
                </li>
                <li>실명을 제외한 개인정보는 모두 가려주세요.</li>
                <li>업로드 가능한 파일 유형은 [png, jpg, pdf] 입니다.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 w-full bg-white pb-14">
        <div className="mx-auto w-full max-w-app px-5">
          <BlockBtn
            className="mb-[29px]"
            disabled={!country || !universityName || !verificationFile}
            onClick={handleNext}
          >
            다음
          </BlockBtn>
        </div>
      </div>
    </div>
  );
};

export default UniversityScreen;
