import Image from "next/image";
import Link from "next/link";

import HomeCollegeCards from "./home-college-cards";
import styles from "./home.module.css";
import CheveronRightFilled from "../ui/icon/ChevronRightFilled";
import MentoCard from "./mento-card";
import NewsCards from "./news-cards";
import HomeSearch from "./home-search";

export default function Home(props) {
  const { setIsSearch } = props; // TopNavigation 변경용
  const { recommendedColleges } = props;
  // 99, 67, 80

  const newsList = [
    { uuid: 1, image: "", title: "2024년도 교환학생을 다녀오며,," },
    { uuid: 2, image: "", title: "독일의 최고 여행지, 드레스덴을 " },
  ];

  const testMentoData = {
    mentoId: 1,
    image: "/images/rabbit.png",
    name: "김솔커",
    country: "스웨덴",
    university: "보라스 대학교",
    period: "2024년 1학기 ~ 2024년 2학기",
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.h1}>교환학생의 첫 걸음,</div>

      <HomeSearch />

      <Link className={styles.banner} href="/score">
        <div className={styles.bannerImageWrapper}>
          <Image className={styles.bannerImage} src="/images/check-grade.jpeg" alt="성적 공유시트 확인하기" width={335} height={54} />
        </div>
        <div className={styles.bannerTextWrapper}>
          <div className={styles.bannerText}>성적 공유시트 확인하기</div>
          <CheveronRightFilled color="#F2F1DF" className={styles.bannerIcon} />
        </div>
      </Link>

      <div style={{ marginTop: "20px" }}>
        <div className={styles.title}>추천하는 파견학교</div>
        <HomeCollegeCards colleges={recommendedColleges} />
      </div>

      <div style={{ marginTop: "24px" }}>
        <div className={styles.title}>활발하게 활동중인 멘토</div>
        <MentoCard {...testMentoData} />
      </div>

      <div style={{ marginTop: "24px" }}>
        <div className={styles.title}>솔커 소식지</div>
        <NewsCards newsList={newsList} />
      </div>
    </div>
  );
}
