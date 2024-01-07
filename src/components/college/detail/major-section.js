import CheckCircleFilled from "@/components/ui/icon/CheckCircleFilled";
import styles from "./major-section.module.css";
import CheckCircleOutlined from "@/components/ui/icon/CheckCircleOutlined";

export default function MajorSection(props) {
  return (
    <div className={styles.section}>
      <div className={styles.infoList} styles={{ marginTop: "16px" }}>
        <div className={styles.info}>
          <CheckCircleOutlined />
          <div className={styles.key}>선발인원</div>
          <div className={styles.value}>3명</div>
        </div>
        <div className={styles.info}>
          <CheckCircleOutlined />
          <div className={styles.key}>등록금 납부 유형</div>
          <div className={styles.value}>본교납입형</div>
        </div>
        <div className={styles.info}>
          <CheckCircleOutlined />
          <div className={styles.key}>파견가능학기</div>
          <div className={styles.value}>2학기</div>
        </div>
        <div className={styles.info}>
          <CheckCircleOutlined />
          <div className={styles.key}>기숙사 제공</div>
          <div className={styles.value}>미제공</div>
        </div>
        <div className={styles.info}>
          <CheckCircleOutlined />
          <div className={styles.key}>관련 홈페이지</div>
          <div className={styles.value}>관련 홈페이지</div>
        </div>
      </div>

      <span className={styles.title}>최저이수학기</span>
      <span className={styles.content}>3학기</span>

      <span className={styles.title}>최저성적 / 기준 성적</span>
      <span className={styles.content}>3.0 / 4.0</span>

      <span className={styles.title}>상세</span>
      <span className={styles.content}>
        타전공 지원 및 수강 가능
        <br />
        <br />
        - 지원 불가능 전공: Pharmacy, Human Medicine and Veterinary Medicine
        <br />
        - Biochemistry, Bioinformatics and Biology, Law 지원 제한적 (학과 사전승인 필요)
        <br />- Business Administration, Economics 학과 수업 대부분이 독일어로 진행, 독일어 가능자 지원 권장
      </span>

      <span className={styles.title}>영어강의 리스트</span>
      <span className={styles.content}>https://www.hwg-lu.de/international/exchange-students-from-partner-institutions/before-mobility/business-courses-in-english-bachelor</span>
    </div>
  );
}
