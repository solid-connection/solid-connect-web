import styles from "./info-section.module.css";
import CheckCircleFilled from "@/components/ui/icon/CheckCircleFilled";
import CheckCircleOutlined from "@/components/ui/icon/CheckCircleOutlined";

export default function InfoSection(props) {
  const { country, region, homepageUrl } = props;
  return (
    <div className={styles.infoList}>
      <div className={styles.info}>
        <CheckCircleFilled />
        <div className={styles.key}>
          {country} {region}
        </div>
      </div>
      <div className={styles.info}>
        <CheckCircleOutlined />
        <div className={styles.key}>홈페이지</div>
        <div className={styles.value}>{homepageUrl}</div>
      </div>
      <div className={styles.info}>
        <CheckCircleOutlined />
        <div className={styles.key}>세부영역</div>
        <div className={styles.value}>아이엘츠 영역별 점수 5.5 이상</div>
      </div>
      <div className={styles.info}>
        <CheckCircleOutlined />
        <div className={styles.key}>기숙사 제공 여부</div>
      </div>
    </div>
  );
}
