import { useState, useRef } from "react";

import styles from "./form.module.css";
import RoundBtn from "@/components/ui/round-btn";
import BlockBtn from "@/components/ui/block-btn";

export default function FormFinal(props) {
  const { setProgress, toNextStage } = props;
  const { languageType, languageScore, languageCert, scoreType, score, scoreCert, setLanguageCert, setScoreCert } = props;

  const languageCertInputRef = useRef(null);
  const scoreCertInputRef = useRef(null);
  const handleLanguageCertButtonClick = () => {
    languageCertInputRef.current.click();
  };
  const handleScoreCertButtonClick = () => {
    scoreCertInputRef.current.click();
  };
  const handleLanguageCertChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLanguageCert(file);
    }
  };
  const handleScoreCertChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setScoreCert(file);
    }
  };

  function handleSubmit() {
    // 입력 필드 유효성 검사
    if (!languageType) {
      alert("어학 종류를 선택해주세요.");
      return;
    }
    if (!languageScore) {
      alert("어학 점수를 입력해주세요.");
      return;
    }
    if (!languageCert) {
      alert("어학 증명서를 첨부해주세요.");
      return;
    }
    if (!score) {
      alert("점수를 입력해주세요.");
      return;
    }
    if (!scoreCert) {
      alert("성적 증명서를 첨부해주세요.");
      return;
    }
    toNextStage();
  }
  const languageTypeConvert = {
    toeic: "토익",
    ibt: "토플 IBT",
    itp: "토플 ITP",
    ielts: "IELTS",
    jlpt: "JLPT",
    others: "기타",
  };
  return (
    <div className={styles.formWrapper}>
      <div className={styles.form} style={{ marginTop: "28px" }}>
        <h1 className={styles.h1Bold}>최종 제출 확인</h1>
        <p>제출 완료 후 성적 을 변경 하실 수 없습니다.</p>
        <div className={styles.list}>
          <div className={styles.item}>
            <div className={styles.key}>어학점수</div>
            <div className={styles.value}>
              <span>{languageTypeConvert[languageType]}</span>
              <span style={{ marginLeft: "33px" }}>{languageScore}</span>
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.key}>대학교 성적</div>
            <div className={styles.value}>
              {score} /{scoreType}
            </div>
          </div>
          <div className={styles.item}>
            <div className={styles.key}>어학 증명서</div>
            <div className={styles.value}>첨부 완료</div>
            <RoundBtn style={{ marginLeft: "7px" }} onClick={handleLanguageCertButtonClick}>
              <input type="file" ref={languageCertInputRef} onChange={handleLanguageCertChange} style={{ display: "none" }} />
              파일 변경하기
            </RoundBtn>
          </div>
          <div className={styles.item}>
            <div className={styles.key}>성적 증명서</div>
            <div className={styles.value}>첨부 완료</div>
            <RoundBtn style={{ marginLeft: "7px" }} onClick={handleScoreCertButtonClick}>
              <input type="file" ref={scoreCertInputRef} onChange={handleScoreCertChange} style={{ display: "none" }} />
              파일 변경하기
            </RoundBtn>
          </div>
        </div>
      </div>
      <div className={styles.blockBtns}>
        <BlockBtn onClick={handleSubmit}>제출하기</BlockBtn>
      </div>
    </div>
  );
}
