import { useState, useRef } from "react";

import styles from "./form.module.css";
import RoundBtn from "@/components/ui/round-btn";
import BlockBtn from "@/components/ui/block-btn";

export default function FormScore(props) {
  const { setProgress, setCurrentStage } = props;

  const fileInputRef = useRef(null);
  const scoreTypeRef = useRef(null);
  const scoreRef = useRef(null);
  const [certName, setCertName] = useState("");

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = () => {
    const file = fileInputRef.current.files[0];
    if (file) {
      setCertName(file.name); // 파일을 선택하면 파일명을 상태로 설정합니다.
    }
  };

  const handleSubmit = () => {
    // 입력 필드 유효성 검사
    if (!scoreRef.current.value) {
      alert("점수를 입력해주세요.");
      return;
    }
    if (fileInputRef.current.files.length === 0) {
      alert("증명서를 첨부해주세요.");
      return;
    }
    const file = fileInputRef.current.files[0];
    // 이제 file과 다른 입력값을 함께 처리할 수 있습니다.
    // 예: FormData를 사용하여 서버에 업로드

    setCurrentStage(3);
  };

  return (
    <div className={styles.form} style={{ marginBottom: "100px" }}>
      <div className={styles.desc}>
        <h1>대학교 성적 입력</h1>
        <p>
          공적 증명서만 인정됩니다.
          <br />
          미인정 서류를 업로드 할 경우 권한이 거부될 수 있습니다.
        </p>
      </div>
      <div className={styles.input} style={{ marginTop: "41px" }}>
        <label htmlFor="type">어학 종류</label>
        <select id="type" ref={scoreTypeRef}>
          <option value="4.5">4.5</option>
          <option value="4.3">4.3</option>
        </select>
      </div>
      <div className={styles.input}>
        <label htmlFor="score">점수</label>
        <input type="text" id="score" ref={scoreRef} />
      </div>
      <div className={styles.input}>
        <label htmlFor="certName">증명서 첨부</label>
        <input type="text" id="certName" value={certName} readOnly /> {/* 읽기 전용 속성 추가 */}
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
