import { useRef } from "react";

import styles from "./form.module.css";
import RoundBtn from "@/components/ui/round-btn";
import BlockBtn from "@/components/ui/block-btn";

export default function FormScore(props) {
  const { setProgress, toNextStage } = props;
  const { setScoreType, setScore, setScoreCert, scoreType, score, scoreCert } = props;

  const fileInputRef = useRef(null);
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = () => {
    const file = fileInputRef.current.files[0];
    if (file) {
      setScoreCert(file);
    }
  };

  const handleSubmit = () => {
    // 입력 필드 유효성 검사
    if (!score) {
      alert("점수를 입력해주세요.");
      return;
    }
    if (!scoreCert) {
      alert("증명서를 첨부해주세요.");
      return;
    }
    // 점수 유효성 검사
    if (scoreType === "4.5") {
      if (!(score >= 0 && score <= 4.5)) {
        alert("학점은 0 ~ 4.5 사이여야 합니다.");
        return;
      }
    } else if (scoreType === "4.3") {
      if (!(score >= 0 && score <= 4.3)) {
        alert("학점은 0 ~ 4.3 사이여야 합니다.");
        return;
      }
    }
    toNextStage();
  };

  return (
    <div className={styles.formWrapper}>
      <div className={styles.form}>
        <h1 className={styles.h1Bold} style={{ marginTop: "36px" }}>
          대학교 성적 입력
        </h1>
        <p>
          공적 증명서만 인정됩니다.
          <br />
          미인정 서류를 업로드 할 경우 권한이 거부될 수 있습니다.
        </p>
        <div className={styles.input} style={{ marginTop: "41px" }}>
          <label htmlFor="type">학점 기준</label>
          <select id="type" value={scoreType} onChange={(e) => setScoreType(e.target.value)}>
            <option value="">선택...</option>
            <option value="4.5">4.5</option>
            <option value="4.3">4.3</option>
          </select>
        </div>
        <div className={styles.input}>
          <label htmlFor="score">점수</label>
          <input type="text" id="score" value={score} onChange={(e) => setScore(e.target.value)} />
        </div>
        <div className={styles.input}>
          <label htmlFor="certName">증명서 첨부</label>
          <input style={{ userSelect: "none" }} type="text" id="certName" value={scoreCert.name || "증명서를 업로드 해주세요"} readOnly onMouseDown={(e) => e.preventDefault()} />
        </div>
        <div className={styles.btns}>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />
          <RoundBtn onClick={handleButtonClick}>파일 첨부하기</RoundBtn>
          <RoundBtn onClick={() => {}} backgroundColor="var(--secondary-1, #C4DDFF)" textColor="#484848">
            증명서 예시
          </RoundBtn>
        </div>
      </div>
      <div className={styles.blockBtns}>
        <BlockBtn onClick={handleSubmit}>다음</BlockBtn>
      </div>
    </div>
  );
}
