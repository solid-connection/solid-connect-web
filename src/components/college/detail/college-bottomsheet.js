import { useState, useEffect, useRef } from "react";

import styles from "./college-bottomsheet.module.css";

import CheckCircleFilled from "@/components/ui/icon/CheckCircleFilled";
import CheckCircleOutlined from "@/components/ui/icon/CheckCircleOutlined";
import CollegeReviews from "./college-reviews";
import GoogleEmbedMap from "@/components/map/google-embed-map";
import ScrollTab from "@/components/ui/scroll-tab";
import LanguageSection from "./language-section";
import MajorSection from "./major-section";
import InfoSection from "./info-secition";

export default function CollegeBottomSheet(props) {
  const { id, name, englishName, country, region, homepageUrl, image, studentCapacity, tuitionFeeType, gpaRequirement, semesterRequirement, languageRequirements } = props;

  const pages = {
    1: "학교정보",
    2: "어학성적",
    3: "지원전공",
    4: "위치",
    5: "파견후기",
  };

  const [activeTab, setActiveTab] = useState(1);
  const sectionRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 현재 보이는 섹션에 따라 activeTab을 업데이트
            const index = sectionRefs.findIndex((ref) => ref.current === entry.target);
            setActiveTab(index + 1);
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

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
    sectionRefs[tabNumber - 1].current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className={styles.blank}></div>
      <div className={styles.bottomSheet}>
        <div className={styles.englishTitle}>{englishName}</div>
        <div className={styles.title}>{name}</div>

        <ScrollTab choices={pages} choice={activeTab} setChoice={handleTabClick} style={{ marginTop: "16px", position: "sticky", top: "56px" }} />

        {/* 학교정보 */}
        <div className={styles.scrollOffset} ref={sectionRefs[0]}>
          <InfoSection country={country} region={region} homepageUrl={homepageUrl} />
        </div>

        {/* 어학성적 */}
        <div className={styles.bar}>
          {languageRequirements.ibt && <div>TOEFL IBT {languageRequirements.ibt}</div>}
          {languageRequirements.itp && <div>TOEFL ITP {languageRequirements.itp}</div>}
          {languageRequirements.toeic && <div>TOEIC {languageRequirements.toeic}</div>}
          {languageRequirements.ielts && <div>IELTS {languageRequirements.ielts}</div>}
          {languageRequirements.hsk && <div>신HSK {languageRequirements.hsk}</div>}
          {languageRequirements.jlpt && <div>JLPT {languageRequirements.jlpt}</div>}
          {languageRequirements.etc && <div>{languageRequirements.etc}</div>}
        </div>
        <div className={styles.scrollOffsetWithBar} ref={sectionRefs[1]}>
          {/* <div className={styles.subject}>어학 성적</div> */}
          <LanguageSection languageRequirements={languageRequirements} />
        </div>

        {/* 지원전공 */}
        <div className={styles.scrollOffsetWithBar} ref={sectionRefs[2]}>
          {/* <div className={styles.subject}>지원 전공</div> */}
          <MajorSection />
        </div>

        {/* 위치 */}
        <div className={styles.scrollOffsetWithBar} ref={sectionRefs[3]}>
          <div className={styles.subject}>위치</div>
          <div className={styles.mapWrapper}>
            <GoogleEmbedMap width="100% - 40px" height="204" style={{ border: 0 }} name={englishName} />
          </div>
        </div>

        {/* 파견후기 */}
        <div className={styles.scrollOffsetWithBar} ref={sectionRefs[4]}>
          <div className={styles.subject}>파견 후기</div>
          <CollegeReviews />
        </div>
      </div>
    </>
  );
}
