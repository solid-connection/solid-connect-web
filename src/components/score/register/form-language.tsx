import { useRef } from "react";

import styles from "./form.module.css";
import RoundBtn from "@/components/ui/round-btn";
import BlockBtn from "@/components/ui/block-btn";
import Link from "next/link";

export default function FormLanguage(props) {
  const { toNextStage } = props;
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

    // 어학 성적별 유효성 검사
    if (languageType === "toeic") {
      if (!(languageScore >= 10 && languageScore <= 990)) {
        alert("TOEIC 점수는 10 ~ 990 사이여야 합니다.");
        return;
      }
    } else if (languageType === "ibt") {
      if (!(languageScore >= 0 && languageScore <= 120)) {
        alert("TOEFL IBT 점수는 0 ~ 120 사이여야 합니다.");
        return;
      }
    } else if (languageType === "itp") {
      if (!(languageScore >= 0 && languageScore <= 677)) {
        alert("TOEFL ITP 점수는 0 ~ 677 사이여야 합니다.");
        return;
      }
    } else if (languageType === "ielts") {
      if (!(languageScore >= 0 && languageScore <= 9)) {
        alert("IELTS 점수는 0 ~ 9 사이여야 합니다.");
        return;
      }
      if (languageScore % 0.5 !== 0) {
        alert("IELTS 점수는 0.5 단위로 입력해주세요.");
        return;
      }
    } else if (languageType === "jlpt") {
      const jptlAvailable = ["N1", "N2", "N3", "N4", "N5", "n1", "n2", "n3", "n4", "n5", "1", "2", "3", "4", "5"];
      if (!jptlAvailable.includes(languageScore)) {
        alert("JLPT 등급은 N1 ~ N5 사이여야 합니다.");
        return;
      }
    }

    // 파일 포맷 검사
    const allowedFileTypes = [
      "image/jpeg", // 이건 jpg와 jpeg 둘 다 커버합니다.
      "image/png",
      "image/webp",
      "application/pdf",
      "application/msword", // 이건 doc를 위한 것입니다.
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // 이건 docx를 위한 것입니다.
    ];
    if (!allowedFileTypes.includes(languageCert.type)) {
      alert("파일 형식이 올바르지 않습니다. (jpg, jpeg, png, webp, pdf, doc, docx 만 가능)");
      return;
    }
    if (languageCert.size > 10000000) {
      alert("파일 크기가 너무 큽니다. 10MB 이하의 파일만 업로드 가능합니다.");
      return;
    }

    toNextStage();
  };

  return (
    <div className={styles.formWrapper}>
      <div className={styles.form}>
        <h1 className={styles.h1Bold} style={{ marginTop: "36px" }}>
          어학 성적 입력
        </h1>
        <p>
          공적 증명서만 인정됩니다.
          <br />
          미인정 서류를 업로드 할 경우 권한이 거부될 수 있습니다.
        </p>
        <div className={styles.input} style={{ marginTop: "41px" }}>
          <label htmlFor="type">어학 종류</label>
          <select id="type" value={languageType} onChange={(e) => setLanguageType(e.target.value)}>
            <option value="">선택...</option>
            <option value="toeic">TOEIC</option>
            <option value="ibt">TOEFL IBT</option>
            <option value="itp">TOEFL ITP</option>
            <option value="ielts">IELTS</option>
            <option value="jlpt">JLPT</option>
            <option value="others">기타</option>
          </select>
        </div>
        <div className={styles.input}>
          <label htmlFor="score">점수</label>
          <input type="text" id="score" value={languageScore} onChange={(e) => setLanguageScore(e.target.value)} />
        </div>
        <div className={styles.input}>
          <label htmlFor="certName">증명서 첨부</label>
          <input style={{ userSelect: "none" }} type="text" id="certName" value={languageCert?.name || "증명서를 업로드 해주세요"} readOnly onMouseDown={(e) => e.preventDefault()} />
        </div>
        <div className={styles.btns}>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />
          <RoundBtn onClick={handleButtonClick}>파일 첨부하기</RoundBtn>
          <Link href="/score/lang-cert-example" target="_blank">
            <RoundBtn backgroundColor="var(--secondary-1, #C4DDFF)" textColor="#484848">
              증명서 예시
            </RoundBtn>
          </Link>
        </div>
      </div>
      <div className={styles.blockBtns}>
        <BlockBtn onClick={handleSubmit}>다음</BlockBtn>
      </div>
    </div>
  );
}
