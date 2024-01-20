import { useState, useEffect, useRef } from "react";

import styles from "./college-bottomsheet.module.css";
import CollegeReviews from "./college-reviews";
import ScrollTab from "@/components/ui/scroll-tab";
import GoogleEmbedMap from "@/components/map/google-embed-map";

export default function CollegeBottomSheet(props) {
  const { id, name, englishName, country, region, homepageUrl, image, studentCapacity, tuitionFeeType, gpaRequirement, semesterRequirement, languageRequirements } = props;

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
        <div className={styles.englishName}>{englishName}</div>
        <div className={styles.name}>{name}</div>

        <ScrollTab choices={pages} choice={activeTab} setChoice={handleTabClick} style={{ marginTop: "16px", position: "sticky", top: "56px" }} />

        {/* 학교정보 */}
        <div className={styles.scrollOffset} ref={sectionRefs[0]}>
          <div className={styles.title}>홈페이지</div>
          <div className={styles.content}>{homepageUrl}</div>
          <div className={styles.title}>기숙사</div>
          <div className={styles.content}>제공되는 기숙사는 없으나 학생 아파트 중계 사이트 제공</div>
          <div className={styles.title}>파견 대학 위치</div>
          <div className={styles.content}>{country}</div>
          <div className={styles.title}>지역정보</div>
          <div className={styles.content}>
            보라스는 중세에 거슬러 올라가는 역사를 자랑하는 스웨덴의 도시 중 하나입니다. 14세기에 건립된 보라스 성은 그 중요한 역사적 유적 중 하나로, 중세 건축 양식을 간직하고 있습니다. 도시는 상업 및 농업으로 번창하며 스웨덴의 중심지로 성장했습니다.
            17세기에는 유명한 보라스 대학이 설립되어 학문과 문화의 중심지로 발전했습니다.
            <br />
            <br />
            또한, 주변의 자연 환경은 평화로운 호수, 운치 있는 숲, 그리고 풍부한 농경지로 구성되어 있어 여행객과 교환학생들에게 다양한 경험을 제공합니다.
          </div>
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
          <div className={styles.title}>어학 세부요건</div>
          <div className={styles.content}>
            - Department of Humanities, Social Science, Business Administration and Economics 수강요건: 독일어 공인성적 B2 레벨 이상의 증빙 필수, Department of Natural Science 수강요건: 독일어 공인성적 B1 레벨 이상 증빙 필수
            <br />
            <br />- John F Kennedy Institute for North American Studies 수강요건: 영어 공인성적 C1 레벨 이상의 증빙 필수
          </div>
        </div>

        {/* 지원전공 */}
        <div className={styles.scrollOffsetWithBar} ref={sectionRefs[2]}>
          <div className={styles.title}>선발 인원</div>
          <div className={styles.content}>{studentCapacity}명</div>
          <div className={styles.title}>등록금 납부 유형</div>
          <div className={styles.content}>{tuitionFeeType}</div>
          <div className={styles.title}>파견가능학기</div>
          <div className={styles.content}>?학기</div>
          <div className={styles.title}>최저이수학기</div>
          <div className={styles.content}>{semesterRequirement}</div>
          <div className={styles.title}>최저성적 / 기준 성적</div>
          <div className={styles.content}>{gpaRequirement ? `${gpaRequirement} / 4.5` : "없음"}</div>
          <div className={styles.title}>전공 상세</div>
          <div className={styles.content}>
            타전공 지원 및 수강 가능
            <br />
            <br />
            - 지원 불가능 전공: Pharmacy, Human Medicine and Veterinary Medicine
            <br />
            - Biochemistry, Bioinformatics and Biology, Law 지원 제한적 (학과 사전승인 필요)
            <br />- Business Administration, Economics 학과 수업 대부분이 독일어로 진행, 독일어 가능자 지원 권장
          </div>
          <div className={styles.title}>영어강의 리스트</div>
          <div className={styles.content}>https://www.hwg-lu.de/international/exchange-students-from-partner-institutions/before-mobility/business-courses-in-english-bachelor</div>
          <div className={styles.title}>비고</div>
          <div className={styles.content}>등록금 관련 정보</div>
        </div>

        {/* 위치 */}
        <div className={styles.scrollOffsetWithBar} ref={sectionRefs[3]}>
          <div className={styles.title}>파견학교 위치</div>
          <div style={{ margin: "0 20px 0 20px" }}>
            <GoogleEmbedMap width="100% - 40px" height="204" style={{ border: 0, marginTop: "10px" }} name={englishName} />
          </div>
        </div>

        {/* 파견후기 */}
        <div className={styles.scrollOffsetWithBar} ref={sectionRefs[4]}>
          <div className={styles.title}>멘토의 생생한 후기</div>
          <CollegeReviews />
        </div>
      </div>
    </>
  );
}
