"use client";

import React, { forwardRef, useEffect, useRef, useState } from "react";

import clsx from "clsx";

import ScrollTab from "@/components/ui/ScrollTab";
import GoogleEmbedMap from "@/components/ui/map/GoogleEmbedMap";

import CollegeReviews from "./CollegeReviews";
import styles from "./college-bottomsheet.module.css";

import { Review } from "@/types/review";
import { LanguageRequirement, University } from "@/types/university";

import {
  deleteUniversityFavoriteApi,
  getUniversityFavoriteStatusApi,
  postUniversityFavoriteApi,
} from "@/api/university";
import { IconBookmarkFilled, IconBookmarkOutlined } from "@/public/svgs";

interface CollegeBottomSheetProps {
  collegeId: number;
  convertedKoreanName: string;
  reviewList: Review[];
  university: University;
}

const CollegeBottomSheet = ({ collegeId, convertedKoreanName, reviewList, university }: CollegeBottomSheetProps) => {
  const pages: string[] = ["어학성적", "학교정보", "지원정보", "지역정보", "파견후기"];
  const [activeTab, setActiveTab] = useState<string>("학교정보");
  const sectionRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const [isLiked, setIsLiked] = useState<boolean>(false);

  useEffect(() => {
    const getFavoriteStatus = async () => {
      try {
        const res = await getUniversityFavoriteStatusApi(collegeId);
        setIsLiked(res.data.isLike);
      } catch {
        // 비로그인 시 무시
      }
    };
    getFavoriteStatus();
  }, [collegeId]);

  const toggleLike = () => {
    const postLike = async () => {
      try {
        const res = !isLiked
          ? await postUniversityFavoriteApi(collegeId)
          : await deleteUniversityFavoriteApi(collegeId);
        const { result } = res.data;
        if (result === "LIKE_SUCCESS") {
          setIsLiked(true);
        } else if (result === "LIKE_CANCELED") {
          setIsLiked(false);
        }
      } catch (err) {
        if (err.response) {
          console.error("Axios response error", err.response);
          if (err.response.status === 401 || err.response.status === 403) {
            alert("로그인이 필요합니다");
            document.location.href = "/login";
          } else {
            alert(err.response.data?.message);
          }
        } else {
          console.error("Error", err.message);
          alert(err.message);
        }
      }
    };
    postLike();
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.findIndex((ref) => ref.current === entry.target);
            setActiveTab(pages[index]);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-103px 0px -60% 0px" },
    );

    sectionRefs.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      sectionRefs.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [sectionRefs]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    sectionRefs[pages.findIndex((t) => t === tab)].current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className={clsx("max-h-80", styles["flexible-height"])}>
        <div className="flex h-full items-end pb-3 pl-8">
          <span className="text-3xl font-semibold text-white">{university.englishName || "대학명"}</span>
        </div>
      </div>
      <div className="relative rounded-t-3xl bg-white">
        <div className="flex h-[69px] items-center justify-between pl-5 pr-[22px] pt-6">
          <div className="font-serif text-2xl font-semibold">{convertedKoreanName || "대학명"}</div>
          <button onClick={toggleLike} type="button">
            {isLiked ? <IconBookmarkFilled /> : <IconBookmarkOutlined />}
          </button>
        </div>

        <ScrollTab
          choices={pages}
          choice={activeTab}
          setChoice={handleTabClick}
          style={{ marginTop: "16px", position: "sticky", top: "56px" }}
          borderColor="var(--primary-2, #091F5B)"
        />

        <LanguageSection ref={sectionRefs[0]} languageRequirements={university.languageRequirements || []} />
        <BasicInfoSection
          ref={sectionRefs[1]}
          homepageUrl={university.homepageUrl}
          region={university.region}
          country={university.country}
          studentCapacity={university.studentCapacity}
          englishName={university.englishName}
        />
        <ApplyInfoSection
          ref={sectionRefs[2]}
          semesterAvailableForDispatch={university.semesterAvailableForDispatch}
          semesterRequirement={university.semesterRequirement}
          gpaRequirement={university.gpaRequirement}
          gpaRequirementCriteria={university.gpaRequirementCriteria}
          detailsForAccommodation={university.detailsForAccommodation}
          detailsForMajor={university.detailsForMajor}
          englishCourseUrl={university.englishCourseUrl}
        />
        <RegionInfoSection ref={sectionRefs[3]} />
        <ReviewSection ref={sectionRefs[4]} />
      </div>
    </>
  );
};

export default CollegeBottomSheet;

const LanguageSection = forwardRef<HTMLDivElement, { languageRequirements: LanguageRequirement[] }>(
  function LanguageSection({ languageRequirements }, ref) {
    return (
      <div ref={ref} className="mx-5 mt-5">
        <div className="flex gap-2">
          {languageRequirements.map((requirement, index) => (
            <div key={index}>
              {requirement.languageTestType}: {requirement.minScore}
            </div>
          ))}
        </div>
      </div>
    );
  },
);

const BasicInfoSection = forwardRef<
  HTMLDivElement,
  {
    homepageUrl: string;
    region: string;
    country: string;
    studentCapacity: number;
    englishName: string;
  }
>(function BasicInfoSection({ homepageUrl, region, country, studentCapacity, englishName }, ref) {
  return (
    <div ref={ref} className="flex flex-col gap-3 px-5 pt-8">
      <BorderBox subject="홈페이지" content={homepageUrl || "정보 없음"} />
      <div className="flex gap-2.5">
        <BorderBox className="flex-1" subject="파견 대학 위치" content={region + " " + country || "정보 없음"} />
        <BorderBox
          className="flex-1"
          subject="선발인원"
          content={studentCapacity ? `${studentCapacity}명` : "정보 없음"}
        />
      </div>
      <div className={clsx("flex flex-col gap-2.5 rounded-lg bg-k-50 p-2.5")}>
        <span className="text-base font-semibold text-k-900">파견학교 위치</span>
        <span className="text-sm font-medium leading-normal text-k-600">
          <GoogleEmbedMap width="100%" height="300px" name={englishName} style={{ border: "0" }} />
        </span>
      </div>
    </div>
  );
});

const ApplyInfoSection = forwardRef<
  HTMLDivElement,
  {
    semesterAvailableForDispatch: string;
    semesterRequirement: string;
    gpaRequirement: string;
    gpaRequirementCriteria: string;
    detailsForAccommodation: string;
    detailsForMajor: string;
    englishCourseUrl: string;
  }
>(function ApplyInfoSection(
  {
    semesterAvailableForDispatch = "정보 없음",
    semesterRequirement = "정보 없음",
    gpaRequirement = "정보 없음",
    gpaRequirementCriteria = "정보 없음",
    detailsForAccommodation = "정보 없음",
    detailsForMajor = "정보 없음",
    englishCourseUrl = "정보 없음",
  },
  ref,
) {
  return (
    <div ref={ref} className="px-5 pt-8">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2.5">
          <BorderBox className="flex-1" subject="파견 가능 학기" content={semesterAvailableForDispatch} />
          <BorderBox className="flex-1" subject="최저이수학기" content={semesterRequirement} />
        </div>
        <div className="flex gap-2.5">
          <BorderBox
            className="min-w-36 flex-1"
            subject="최저성적/기준성적"
            content={gpaRequirement + "/" + gpaRequirementCriteria}
          />
          <BorderBox className="flex-[2]" subject="기숙사" content={detailsForAccommodation} />
        </div>
        <BackgroundBox className="min-h-[150px]" subject="전공 상세" content={detailsForMajor} />
        <BackgroundBox className="min-h-[150px]" subject="영어 강의 리스트" content={englishCourseUrl} />
      </div>
    </div>
  );
});

const RegionInfoSection = forwardRef<
  HTMLDivElement,
  {
    detailsForLocal: string;
  }
>(function RegionInfoSection({ detailsForLocal = "지역 정보가 없습니다." }, ref) {
  return (
    <div ref={ref} className="flex flex-col gap-4 px-5 pt-8">
      <div>사진이 여기 들어갑니다</div>
      <BackgroundBox className="min-h-[150px]" subject="지역 정보" content={detailsForLocal} />
    </div>
  );
});

const ReviewSection = forwardRef<HTMLDivElement, {}>(function ReviewSection({}, ref) {
  return (
    <div ref={ref} className="px-5 pt-8">
      <span className="text-base font-semibold text-k-900">생생한 후기</span>
      <div className="h-40"></div>
    </div>
  );
});

const BorderBox = ({ subject, content, className }: { subject: string; content: string; className?: string }) => {
  return (
    <div className={clsx("flex flex-col gap-2.5 rounded-lg border border-secondary p-2.5", className)}>
      <span className="text-base font-semibold text-k-900">{subject}</span>
      <span className="text-sm font-medium leading-normal text-k-600">{content}</span>
    </div>
  );
};

const BackgroundBox = ({ subject, content, className }: { subject: string; content: string; className?: string }) => {
  return (
    <div className={clsx("flex flex-col gap-2.5 rounded-lg bg-k-50 p-2.5", className)}>
      <span className="text-base font-semibold text-k-900">{subject}</span>
      <span className="text-sm font-medium leading-normal text-k-600">{content}</span>
    </div>
  );
};
