import { useState, useEffect, useRef } from "react";

import styles from "./college-bottomsheet.module.css";

import CheckCircleFilled from "@/components/ui/icon/CheckCircleFilled";
import CheckCircleOutlined from "@/components/ui/icon/CheckCircleOutlined";
import CollegeReviews from "./college-reviews";
import GoogleEmbedMap from "@/components/map/google-embed-map";
import ScrollTab from "@/components/ui/scroll-tab";
import LanguageSection from "./language-section";
import MajorSection from "./major-section";

export default function CollegeBottomSheet(props) {
  const { id, name, englishName, country, region, url, requirements } = props;

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

        <div className={styles.scrollOffset} ref={sectionRefs[0]}>
          <div className={styles.infoList}>
            <div className={styles.info}>
              <CheckCircleFilled />
              <div className={styles.infoKey}>
                {country} {region}
              </div>
            </div>
            <div className={styles.info}>
              <CheckCircleOutlined />
              <div className={styles.infoKey}>어학점수</div>
              <div className={styles.infoValue}>토익 800 토플 100 아이엘츠 6.5 기타 어학</div>
            </div>
            <div className={styles.info}>
              <CheckCircleOutlined />
              <div className={styles.infoKey}>세부영역</div>
              <div className={styles.infoValue}>아이엘츠 영역별 점수 5.5 이상</div>
            </div>
            <div className={styles.info}>
              <CheckCircleOutlined />
              <div className={styles.infoKey}>기숙사 제공 여부</div>
            </div>
          </div>
        </div>

        <div className={styles.scrollOffset} ref={sectionRefs[1]}>
          {/* <div className={styles.subject}>어학 성적</div> */}
          <LanguageSection />
        </div>

        <div className={styles.scrollOffset} ref={sectionRefs[2]}>
          {/* <div className={styles.subject}>지원 전공</div> */}
          <MajorSection />
        </div>

        <div className={styles.scrollOffset} ref={sectionRefs[3]}>
          <div className={styles.subject}>위치</div>
          <div className={styles.mapWrapper}>
            <GoogleEmbedMap width="100% - 40px" height="204" style={{ border: 0 }} name="Stanford University" />
          </div>
        </div>

        <div className={styles.scrollOffset} ref={sectionRefs[4]}>
          <div className={styles.subject}>파견 후기</div>
          <CollegeReviews />
        </div>
      </div>
    </>
  );
}
