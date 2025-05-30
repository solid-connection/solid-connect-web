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
        <BasicInfoSection ref={sectionRefs[1]} />
        <MapSection />
        <ApplyInfoSection ref={sectionRefs[2]} />
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
    homepageUrl?: string;
    region?: string;
    country?: string;
    studentCapacity?: number;
  }
>(function BasicInfoSection({ homepageUrl, region, country, studentCapacity }, ref) {
  return (
    <div ref={ref} className="px-5 pt-8">
      <div className=""></div>
    </div>
  );
});

const MapSection = () => {
  return (
    <div className="px-5 pt-6">
      <h2 className="mb-4 text-xl font-semibold">학교 위치</h2>
      <GoogleEmbedMap />
    </div>
  );
};

const ApplyInfoSection = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className="px-5 pt-6">
      <h2 className="mb-4 text-xl font-semibold">지원정보</h2>
      <p className="text-base text-gray-700">지원정보가 없습니다.</p>
    </div>
  );
});

const RegionInfoSection = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className="px-5 pt-6">
      <h2 className="mb-4 text-xl font-semibold">지역정보</h2>
      <p className="text-base text-gray-700">지역정보가 없습니다.</p>
    </div>
  );
});

const ReviewSection = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className="px-5 pt-6">
      <h2 className="mb-4 text-xl font-semibold">파견후기</h2>
      <p className="text-base text-gray-700">파견후기가 없습니다.</p>
    </div>
  );
});
