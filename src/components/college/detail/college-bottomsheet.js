import { useState, useEffect, useRef } from "react";

import styles from "./college-bottomsheet.module.css";
import CollegeReviews from "./college-reviews";
import ScrollTab from "@/components/ui/scroll-tab";
import GoogleEmbedMap from "@/components/ui/map/google-embed-map";

export default function CollegeBottomSheet(props) {
  const { id, term, koreanName, englishName, formatName, region, country, homepageUrl, logoImageUrl, backgroundImageUrl, detailsForLocal } = props;
  const { studentCapacity, tuitionFeeType, semesterAvailableForDispatch } = props;
  const { languageRequirements, detailsForLanguage, gpaRequirement, gpaRequirementCriteria, semesterRequirement } = props;
  const { detailsForApply, detailsForMajor, detailsForAccommodation, accommodationUrl, detailsForEnglishCourse, englishCourseUrl, details } = props;

  const pages = ["학교정보", "어학성적", "지원전공", "위치", "파견후기"];
  const [activeTab, setActiveTab] = useState("학교정보");
  const sectionRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 현재 보이는 섹션에 따라 activeTab을 업데이트
            const index = sectionRefs.findIndex((ref) => ref.current === entry.target);
            setActiveTab(pages[index]);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-103px 0px -60% 0px" }
    );

    sectionRefs.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () =>
      sectionRefs.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    sectionRefs[pages.findIndex((t) => t === tab)].current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className={styles.blank}></div>
      <div className={styles.bottomSheet}>
        <div className={styles.englishName}>{englishName || "대학명"}</div>
        <div className={styles.name}>{koreanName || "대학명"}</div>

        <ScrollTab choices={pages} choice={activeTab} setChoice={handleTabClick} style={{ marginTop: "16px", position: "sticky", top: "56px" }} borderColor="var(--primary-2, #091F5B)" />

        {/* 학교정보 */}
        <div className={styles.scrollOffset} style={{ paddingTop: "123px" }} ref={sectionRefs[0]}>
          <div className={styles.item}>
            <div className={styles.title}>홈페이지</div>
            <div className={styles.content}>
              <a href={homepageUrl || ""} target="_blank" rel="noreferrer">
                {homepageUrl || "홈페이지 없음"}
              </a>
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.title}>기숙사</div>

            <div className={styles.content}>
              {accommodationUrl && (
                <>
                  <a href={accommodationUrl} target="_blank" rel="noreferrer" className={styles.content}>
                    {accommodationUrl}
                  </a>
                  <br />
                </>
              )}
              <div
                dangerouslySetInnerHTML={{
                  __html: detailsForAccommodation || "기숙사 추가 정보 없음",
                }}
              />
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.title}>파견 대학 위치</div>
            <div className={styles.content}>
              {region} {country}
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.title}>지역정보</div>
            <div className={styles.content}>
              <div dangerouslySetInnerHTML={{ __html: detailsForLocal || "지역정보 없음" }} />
            </div>
          </div>
        </div>

        {/* 어학성적 */}
        <div className={styles.bar}>
          {languageRequirements.map((language, index) => {
            let minScore;
            if (language.languageTestType === "TOEFL_IBT") {
              minScore = Math.trunc(language.minScore);
            } else if (language.languageTestType === "TOEFL_ITP") {
              minScore = Math.trunc(language.minScore);
            } else {
              minScore = language.minScore;
            }
            return (
              <div key={index}>
                {language.languageTestType.replace(/_/g, " ")} {minScore}
              </div>
            );
          })}
        </div>
        <div className={styles.scrollOffsetWithBar} ref={sectionRefs[1]}>
          <div className={styles.item}>
            <div className={styles.title}>어학 세부요건</div>
            <div className={styles.content}>
              <div dangerouslySetInnerHTML={{ __html: detailsForLanguage || "어학 세부요건 없음" }} />
            </div>
          </div>
        </div>

        {/* 지원전공 */}
        <div className={styles.scrollOffset} ref={sectionRefs[2]}>
          <div className={styles.item}>
            <div className={styles.title}>선발 인원</div>
            <div className={styles.content}>{studentCapacity || "?"}명</div>
          </div>
          <div className={styles.item}>
            <div className={styles.title}>등록금 납부 유형</div>
            <div className={styles.content}>{tuitionFeeType || "등록금 납부 유형 정보 없음"}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.title}>파견가능학기</div>
            <div className={styles.content}>{semesterAvailableForDispatch || "파견가능학기 정보 없음"}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.title}>최저이수학기</div>
            <div className={styles.content}>{semesterRequirement || "최저이수학기 정보 없음"}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.title}>최저성적 / 기준 성적</div>
            <div className={styles.content}>{gpaRequirement ? `${gpaRequirement} / ${gpaRequirementCriteria}` : "없음"}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.title}>전공 상세</div>
            <div className={styles.content}>
              <div dangerouslySetInnerHTML={{ __html: detailsForMajor || "전공 상세 정보 없음" }} />
            </div>
          </div>

          <div className={styles.item}>
            <div className={styles.title}>영어강의 리스트</div>

            <div className={styles.content}>
              {englishCourseUrl && (
                <>
                  <a href={englishCourseUrl} target="_blank" rel="noreferrer" className={styles.content}>
                    {englishCourseUrl}
                  </a>
                  <br />
                </>
              )}
              <div dangerouslySetInnerHTML={{ __html: detailsForEnglishCourse || "영어강의 추가 정보 없음" }} />
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.title}>비고</div>
            <div className={styles.content}>
              <div dangerouslySetInnerHTML={{ __html: details || "비고 없음" }} />
            </div>
          </div>
        </div>

        {/* 위치 */}
        <div className={styles.scrollOffset} ref={sectionRefs[3]}>
          <div className={styles.item}>
            <div className={styles.title}>파견학교 위치</div>
            <div className={styles.content}>
              <GoogleEmbedMap width="100%" height="204" style={{ border: 0 }} name={englishName} />
            </div>
          </div>
        </div>

        {/* 파견후기 */}
        <div className={styles.scrollOffset} ref={sectionRefs[4]}>
          <div className={styles.item}>
            <div className={styles.title}>멘토의 생생한 후기</div>
            <CollegeReviews style={{ marginTop: "10px" }} />
          </div>
        </div>
      </div>
    </>
  );
}
