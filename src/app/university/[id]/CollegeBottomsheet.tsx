"use client";

import { useEffect, useRef, useState } from "react";

import { getUniversityFavoriteStatusApi, postUniversityFavoriteApi } from "@/services/university";

import ScrollTab from "@/components/ui/ScrollTab";
import GoogleEmbedMap from "@/components/ui/map/GoogleEmbedMap";

import CollegeReviews from "./CollegeReviews";
import styles from "./college-bottomsheet.module.css";

import { Review } from "@/types/review";
import { University } from "@/types/university";

import { IconBookmarkFilled, IconBookmarkOutlined } from "@/public/svgs";

interface CollegeBottomSheetProps {
  collegeId: number;
  convertedKoreanName: string;
  reviewList: Review[];
  university: University;
}

const CollegeBottomSheet = ({ collegeId, convertedKoreanName, reviewList, university }: CollegeBottomSheetProps) => {
  const pages: string[] = ["학교정보", "어학성적", "지원전공", "위치", "파견후기"];
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
        const res = await postUniversityFavoriteApi(collegeId);
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
      <div className={styles.blank} />
      <div className={styles.bottomSheet}>
        <div className={styles.englishName}>{university.englishName || "대학명"}</div>
        <div className="flex h-[69px] items-center justify-between pl-5 pr-[22px] pt-6">
          <div className={styles.name}>{convertedKoreanName || "대학명"}</div>
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

        {/* 학교정보 */}
        <div className={styles.scrollOffset} style={{ paddingTop: "123px" }} ref={sectionRefs[0]}>
          <div className={styles.item}>
            <div className={styles.title}>홈페이지</div>
            <div className={styles.content}>
              <a href={university.homepageUrl || ""} target="_blank" rel="noreferrer">
                {university.homepageUrl || "홈페이지 없음"}
              </a>
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.title}>기숙사</div>

            <div className={styles.content}>
              {university.accommodationUrl && (
                <>
                  <a href={university.accommodationUrl} target="_blank" rel="noreferrer" className={styles.content}>
                    {university.accommodationUrl}
                  </a>
                  <br />
                </>
              )}
              <div
                dangerouslySetInnerHTML={{
                  __html: university.detailsForAccommodation || "기숙사 추가 정보 없음",
                }}
              />
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.title}>파견 대학 위치</div>
            <div className={styles.content}>
              {university.region} {university.country}
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.title}>지역정보</div>
            <div className={styles.content}>
              <div dangerouslySetInnerHTML={{ __html: university.detailsForLocal || "지역정보 없음" }} />
            </div>
          </div>
        </div>

        {/* 어학성적 */}
        <div className={styles.bar}>
          {university.languageRequirements.map((language) => (
            <div key={language.languageTestType}>
              {language.languageTestType.replace(/_/g, " ")} {language.minScore}
            </div>
          ))}
        </div>
        <div className={styles.scrollOffsetWithBar} ref={sectionRefs[1]}>
          <div className={styles.item}>
            <div className={styles.title}>어학 세부요건</div>
            <div className={styles.content}>
              <div dangerouslySetInnerHTML={{ __html: university.detailsForLanguage || "어학 세부요건 없음" }} />
            </div>
          </div>
        </div>

        {/* 지원전공 */}
        <div className={styles.scrollOffset} ref={sectionRefs[2]}>
          <div className={styles.item}>
            <div className={styles.title}>선발 인원</div>
            <div className={styles.content}>{university.studentCapacity || "?"}명</div>
          </div>
          <div className={styles.item}>
            <div className={styles.title}>등록금 납부 유형</div>
            <div className={styles.content}>{university.tuitionFeeType || "등록금 납부 유형 정보 없음"}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.title}>파견가능학기</div>
            <div className={styles.content}>{university.semesterAvailableForDispatch || "파견가능학기 정보 없음"}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.title}>최저이수학기</div>
            <div className={styles.content}>{university.semesterRequirement || "최저이수학기 정보 없음"}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.title}>최저성적 / 기준 성적</div>
            <div className={styles.content}>
              {university.gpaRequirement
                ? `${university.gpaRequirement} / ${university.gpaRequirementCriteria}`
                : "없음"}
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.title}>전공 상세</div>
            <div className={styles.content}>
              <div dangerouslySetInnerHTML={{ __html: university.detailsForMajor || "전공 상세 정보 없음" }} />
            </div>
          </div>

          <div className={styles.item}>
            <div className={styles.title}>영어강의 리스트</div>

            <div className={styles.content}>
              {university.englishCourseUrl && (
                <>
                  <a href={university.englishCourseUrl} target="_blank" rel="noreferrer" className={styles.content}>
                    {university.englishCourseUrl}
                  </a>
                  <br />
                </>
              )}
              <div
                dangerouslySetInnerHTML={{ __html: university.detailsForEnglishCourse || "영어강의 추가 정보 없음" }}
              />
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.title}>비고</div>
            <div className={styles.content}>
              <div dangerouslySetInnerHTML={{ __html: university.details || "비고 없음" }} />
            </div>
          </div>
        </div>

        {/* 위치 */}
        <div className={styles.scrollOffset} ref={sectionRefs[3]}>
          <div className={styles.item}>
            <div className={styles.title}>파견학교 위치</div>
            <div className={styles.content}>
              <GoogleEmbedMap width="100%" height="204" style={{ border: 0 }} name={university.englishName} />
            </div>
          </div>
        </div>

        {/* 파견후기 */}
        <div className={styles.scrollOffset} ref={sectionRefs[4]}>
          <div className={styles.item} style={{ marginBottom: "30px" }}>
            <div className={styles.title}>생생한 후기</div>
            <CollegeReviews style={{ marginTop: "10px" }} reviewList={reviewList} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CollegeBottomSheet;
