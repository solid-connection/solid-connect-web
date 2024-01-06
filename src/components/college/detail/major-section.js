import styles from "./major-section.module.css";

export default function MajorSection(props) {
  return (
    <div className={styles.section}>
      <p></p>

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
    </div>
  );
}
