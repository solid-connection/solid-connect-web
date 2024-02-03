import { useState, useRef } from "react";

import styles from "./form.module.css";
import RoundBtn from "@/components/ui/round-btn";
import BlockBtn from "@/components/ui/block-btn";

export default function FormLanguage(props) {
  const { setProgress, toNextStage } = props;
  const { setLanguageType, setLanguageScore, setLanguageCert, languageType, languageScore, languageCert } = props;

  const fileInputRef = useRef(null);
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLanguageCert(file);
    }
  };

  const handleSubmit = () => {
    // 입력 필드 유효성 검사
    if (!languageType) {
      alert("어학 종류를 선택해주세요.");
      return;
    }
    if (!languageScore) {
      alert("점수를 입력해주세요.");
      return;
    }
    if (!languageCert) {
      alert("증명서를 첨부해주세요.");
      return;
    }
    toNextStage();
  };

  return (
    <div className={styles.form} style={{ marginBottom: "150px" }}>
      <div className={styles.desc}>
        <h1>어학 성적 입력</h1>
        <p>
          공적 증명서만 인정됩니다.
          <br />
          미인정 서류를 업로드 할 경우 권한이 거부될 수 있습니다.
        </p>
      </div>
      <div className={styles.input} style={{ marginTop: "41px" }}>
        <label htmlFor="type">어학 종류</label>
        <select id="type" value={languageType} onChange={(e) => setLanguageType(e.target.value)}>
          <option value="">선택...</option>
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
        <input type="text" id="score" value={languageScore} onChange={(e) => setLanguageScore(e.target.value)} />
      </div>
      <div className={styles.input}>
        <label htmlFor="certName">증명서 첨부</label>
        <input type="text" id="certName" value={languageCert.name || "증명서를 업로드 해주세요"} readOnly />
      </div>
      <div className={styles.btns}>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />
        <RoundBtn onClick={handleButtonClick}>파일 첨부하기</RoundBtn>
        <RoundBtn onClick={() => {}} backgroundColor="var(--secondary-1, #C4DDFF)" textColor="#484848">
          증명서 예시
        </RoundBtn>
      </div>
      <BlockBtn style={{ position: "fixed", width: "calc(100% - 40px)", maxWidth: "560px", bottom: "86px" }} onClick={handleSubmit}>
        다음
      </BlockBtn>
    </div>
  );
}
