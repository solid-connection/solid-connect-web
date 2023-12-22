import styles from "./college-bottomsheet.module.css";

import CollegeMap from "./college-map";
import CheckCircleFilled from "@/components/ui/icon/CheckCircleFilled";
import CheckCircleOutlined from "@/components/ui/icon/CheckCircleOutlined";
import CollegeReviews from "./college-reviews";
import { Fragment } from "react";

function CollegeBottomSheet(props) {
  const { id, name, englishName, country, region, url, requirements } = props;
  return (
    <div className={styles.bottomSheet}>
      <div className={styles.englishTitle}>{englishName}</div>
      <div className={styles.title}>{name}</div>
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
      <CollegeMap />
      <div className={styles.subject}>파견 후기</div>
      <CollegeReviews />
      <div>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It
        has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with
        desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an
        unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the
        release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
        Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic
        typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem
        Ipsum.
      </div>
    </div>
  );
}

export default CollegeBottomSheet;
