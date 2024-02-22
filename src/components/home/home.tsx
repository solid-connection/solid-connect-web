import Image from "next/image";
import Link from "next/link";

import styles from "./home.module.css";
import HomeCollegeCards from "./home-college-cards";
import MentoCard from "./mento-card";
import NewsCards from "./news-cards";
import HomeSearch from "./search/home-search";
import CheveronRightFilled from "../ui/icon/ChevronRightFilled";
import SearchFilled from "../ui/icon/SearchFilled";
import { News, CardCollege } from "@/types/college";
import { ApplyStatus } from "@/types/application";

export default function Home({ recommendedColleges, newsList, applyStatus }: { recommendedColleges: CardCollege[]; newsList: News[]; applyStatus: ApplyStatus }) {
  // const testMentoData = {
  //   mentoId: 1,
  //   image: "/images/rabbit.png",
  //   name: "김솔커",
  //   country: "스웨덴",
  //   university: "보라스 대학교",
  //   period: "2024년 1학기 ~ 2024년 2학기",
  // };

  function getBanner() {
    if (applyStatus === "NOT_SUBMITTED") {
      return (
        <Link className={styles.banner} href="/score/register">
          <div className={styles.bannerTextWrapper}>
            <div className={styles.bannerText}>나의 성적 입력하기</div>
            <CheveronRightFilled color="#F2F1DF" className={styles.bannerIcon} />
          </div>
        </Link>
      );
    } else if (applyStatus === "SCORE_SUBMITTED") {
      return (
        <Link className={styles.banner} href="/score/college-register">
          <div className={styles.bannerTextWrapper}>
            <div className={styles.bannerText}>지원 대학 입력하기</div>
            <CheveronRightFilled color="#F2F1DF" className={styles.bannerIcon} />
          </div>
        </Link>
      );
    } else if (applyStatus === "SUBMITTED_PENDING") {
      return (
        <Link className={styles.banner} href="/score/register">
          <div className={styles.bannerTextWrapper}>
            <div className={styles.bannerText}>나의 성적 다시 입력하기</div>
            <CheveronRightFilled color="#F2F1DF" className={styles.bannerIcon} />
          </div>
        </Link>
      );
    } else if (applyStatus === "SUBMITTED_REJECTED") {
      // 추가 알림 필요함
      return (
        <Link className={styles.banner} href="/score/register">
          <div className={styles.bannerTextWrapper}>
            <div className={styles.bannerText}>[제출 거부됨]나의 성적 다시 입력하기</div>
            <CheveronRightFilled color="#F2F1DF" className={styles.bannerIcon} />
          </div>
        </Link>
      );
    } else if (applyStatus === "SUBMITTED_APPROVED") {
      return (
        <Link className={styles.banner} href="/score">
          <div className={styles.bannerTextWrapper}>
            <div className={styles.bannerText}>지원자 현황 확인하기</div>
            <CheveronRightFilled color="#F2F1DF" className={styles.bannerIcon} />
          </div>
        </Link>
      );
    } else {
      return (
        <Link className={styles.banner} href="/score">
          <div className={styles.bannerTextWrapper}>
            <div className={styles.bannerText}>지원자 현황 확인하기</div>
            <CheveronRightFilled color="#F2F1DF" className={styles.bannerIcon} />
          </div>
        </Link>
      );
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.h1}>교환학생의 첫 걸음,</div>

      <Link href="/search" style={{ display: "block", marginTop: "16px", marginRight: "20px" }}>
        <div className={styles.searchButton}>
          <div>해외 학교를 검색하세요.</div>
          <SearchFilled color="#6F90D1" opacity="1" />
        </div>
      </Link>

      <HomeSearch />

      {getBanner()}

      <div style={{ marginTop: "20px" }}>
        <div className={styles.title}>추천하는 파견학교</div>
        <HomeCollegeCards colleges={recommendedColleges} />
      </div>
      {/* 
      <div style={{ marginTop: "24px" }}>
        <div className={styles.title}>활발하게 활동중인 멘토</div>
        <MentoCard {...testMentoData} />
      </div> */}

      <div style={{ marginTop: "24px" }}>
        <div className={styles.title}>솔커 소식지</div>
        <NewsCards newsList={newsList} />
      </div>
    </div>
  );
}
