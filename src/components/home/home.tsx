import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import {
  IconApplicantBanner,
  IconScoreBanner,
  IconSearchBanner,
  IconSpeaker,
  IconTablerSearch,
} from "../../../public/svgs";
import CheveronRightFilled from "../ui/icon/ChevronRightFilled";
import SearchFilled from "../ui/icon/SearchFilled";
import HomeCollegeCards from "./home-college-cards";
import styles from "./home.module.css";
import NewsCards from "./news-cards";
import HomeSearch from "./search/home-search";

import { ApplyStatus } from "@/types/application";
import { News } from "@/types/news";
import { ListUniversity } from "@/types/university";

type HomeProps = {
  recommendedColleges: ListUniversity[];
  newsList: News[];
  applyStatus: ApplyStatus;
};

export default function Home({ recommendedColleges, newsList, applyStatus }: HomeProps) {
  // function getBanner() {
  //   if (applyStatus === "NOT_SUBMITTED") {
  //     return (
  //       <Link className={styles.banner} href="/score/college-register">
  //         <div className={styles.bannerTextWrapper}>
  //           <div className={styles.bannerText}>지원 대학 입력하기</div>
  //           <CheveronRightFilled color="#F2F1DF" className={styles.bannerIcon} />
  //         </div>
  //       </Link>
  //     );
  //   } else if (applyStatus === "COLLEGE_SUBMITTED") {
  //     return (
  //       <Link className={styles.banner} href="/score/register">
  //         <div className={styles.bannerTextWrapper}>
  //           <div className={styles.bannerText}>나의 성적 입력하기</div>
  //           <CheveronRightFilled color="#F2F1DF" className={styles.bannerIcon} />
  //         </div>
  //       </Link>
  //     );
  //   } else if (applyStatus === "SCORE_SUBMITTED") {
  //     return (
  //       <Link className={styles.banner} href="/score/college-register">
  //         <div className={styles.bannerTextWrapper}>
  //           <div className={styles.bannerText}>지원 대학 입력하기</div>
  //           <CheveronRightFilled color="#F2F1DF" className={styles.bannerIcon} />
  //         </div>
  //       </Link>
  //     );
  //   } else if (applyStatus === "SUBMITTED_PENDING") {
  //     return (
  //       <Link className={styles.banner} href="/score/register">
  //         <div className={styles.bannerTextWrapper}>
  //           <div className={styles.bannerText}>[승인 요청 중입니다]나의 성적 다시 입력하기</div>
  //           <CheveronRightFilled color="#F2F1DF" className={styles.bannerIcon} />
  //         </div>
  //       </Link>
  //     );
  //   } else if (applyStatus === "SUBMITTED_REJECTED") {
  //     // 추가 알림 필요함
  //     return (
  //       <Link className={styles.banner} href="/score/register">
  //         <div className={styles.bannerTextWrapper}>
  //           <div className={styles.bannerText}>[제출 거부됨]나의 성적 다시 입력하기</div>
  //           <CheveronRightFilled color="#F2F1DF" className={styles.bannerIcon} />
  //         </div>
  //       </Link>
  //     );
  //   } else if (applyStatus === "SUBMITTED_APPROVED") {
  //     return (
  //       <Link className={styles.banner} href="/score">
  //         <div className={styles.bannerTextWrapper}>
  //           <div className={styles.bannerText}>지원자 현황 확인하기</div>
  //           <CheveronRightFilled color="#F2F1DF" className={styles.bannerIcon} />
  //         </div>
  //       </Link>
  //     );
  //   } else {
  //     return (
  //       <Link className={styles.banner} href="/score">
  //         <div className={styles.bannerTextWrapper}>
  //           <div className={styles.bannerText}>지원자 현황 확인하기</div>
  //           <CheveronRightFilled color="#F2F1DF" className={styles.bannerIcon} />
  //         </div>
  //       </Link>
  //     );
  //   }
  // }

  return (
    <div className={styles.home}>
      {/* <Link href="/search" style={{ display: "block", marginTop: "16px", marginRight: "20px" }}>
        <div className={styles.searchButton}>
          <div>해외 학교를 검색하세요.</div>
          <SearchFilled color="#6F90D1" opacity="1" />
        </div>
      </Link> */}

      {/* <HomeSearch /> */}

      {/* {getBanner()} */}

      <CollegeSearch />

      <Link href="/college" className={styles["search-banner"]}>
        <div className={styles["search-banner__left"]}>
          <div className={styles["search-banner__title"]}>아직 학교를 결정하지 못했다면?</div>
          <div className={styles["search-banner__description"]}>
            내가 원하는 지역만 선택하고
            <br />
            모든 학교 목록을 확인해보세요!
          </div>
        </div>
        <div className={styles["search-banner__icon"]}>
          <IconSearchBanner />
        </div>
      </Link>

      <div className={styles["application-banners"]}>
        <Link href="/score/register" className={styles["score-banner"]}>
          <div className={styles["score-banner__top"]}>
            <div className={styles["score-banner__title"]}>성적 입력하기</div>
            <div className={styles["score-banner__description"]}>성적 입력하고 등수를 확인해보세요</div>
          </div>
          <div className={styles["score-banner__icon"]}>
            <IconScoreBanner />
          </div>
        </Link>
        <Link href="/score" className={styles["applicant-banner"]}>
          <div className={styles["applicant-banner__top"]}>
            <div className={styles["applicant-banner__title"]}>지원자 현황 확인</div>
            <div className={styles["applicant-banner__description"]}>경쟁률을 바로 분석해드려요</div>
          </div>
          <div className={styles["applicant-banner__icon"]}>
            <IconApplicantBanner />
          </div>
        </Link>
      </div>

      <div style={{ marginTop: "20px" }}>
        <div className={styles.title}>추천하는 파견학교</div>
        <HomeCollegeCards colleges={recommendedColleges} />
      </div>

      <div style={{ marginTop: "24px" }}>
        <div className={styles.title}>
          솔커에서 맛보는 소식
          <IconSpeaker />
        </div>
        <NewsCards newsList={newsList} />
      </div>
    </div>
  );
}

function CollegeSearch() {
  const [searchText, setSearchText] = useState<string>("");
  const router = useRouter();

  const onSearch = (e) => {
    e.preventDefault();
    router.push(`/college?keyword=${searchText}`);
  };
  return (
    <div className={styles["college-search"]}>
      <form className={styles["search-container"]} onSubmit={onSearch}>
        <input
          type="text"
          placeholder="원하는 해외 학교를 검색해보세요"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button className={styles["search-button"]} type="submit">
          <IconTablerSearch />
        </button>
      </form>
    </div>
  );
}
