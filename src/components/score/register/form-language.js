import styles from "./form.module.css";

export default function FormLanguage() {
  // 첫번째 어학성적 폼
  return (
    <div className={styles.form}>
      <div className={styles.description}>
        <h1>어학 성적 입력</h1>
        <p>
          공적 증명서만 인정됩니다.
          <br />
          미인정 서류를 업로드 할 경우 권한이 거부될 수 있습니다.
        </p>
      </div>
      <div className={styles.input} style={{ marginTop: "41px" }}>
        <label htmlFor="type">어학 종류</label>
        <select id="type">
          <option value="toeic">TOEIC</option>
          <option value="toefl">TOEFL</option>
          <option value="ielts">IELTS</option>
          <option value="teps">TEPS</option>
          <option value="opic">OPIC</option>
          <option value="others">기타</option>
        </select>
      </div>
      <div className={styles.input}>
        <label htmlFor="score">점수</label>
        <input type="text" id="score" />
      </div>
      <div className={styles.input}>
        <label htmlFor="cert">증명서 첨부</label>
        <input type="file" id="cert" />
      </div>
    </div>
  );
}
