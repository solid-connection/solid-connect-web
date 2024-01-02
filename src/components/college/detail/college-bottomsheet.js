import { useState } from "react";

import styles from "./college-bottomsheet.module.css";

import CheckCircleFilled from "@/components/ui/icon/CheckCircleFilled";
import CheckCircleOutlined from "@/components/ui/icon/CheckCircleOutlined";
import CollegeReviews from "./college-reviews";
import GoogleEmbedMap from "@/components/map/google-embed-map";
import ScrollTab from "@/components/ui/scroll-tab";

function CollegeBottomSheet(props) {
  const { id, name, englishName, country, region, url, requirements } = props;
  const [page, setPage] = useState(1);
  const pages = {
    1: "학교정보",
    2: "어학성적",
    3: "지원전공",
    4: "위치",
    5: "파견후기",
  };
  return (
    <div className={styles.bottomSheet}>
      <div className={styles.englishTitle}>{englishName}</div>
      <div className={styles.title}>{name}</div>

      <div className={styles.tabWrapper}>
        <ScrollTab choices={pages} choice={page} setChoice={setPage} />
      </div>

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

      <div className={styles.subject}>위치</div>
      <div className={styles.mapWrapper}>
        <GoogleEmbedMap width="100% - 40px" height="204" className={styles.map} name="Stanford University" />
      </div>

      <div className={styles.subject}>파견 후기</div>
      <CollegeReviews />
    </div>
  );
}

export default CollegeBottomSheet;
