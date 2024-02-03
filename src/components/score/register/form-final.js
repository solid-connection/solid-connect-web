import { useState, useRef } from "react";

import styles from "./form.module.css";
import RoundBtn from "@/components/ui/round-btn";
import BlockBtn from "@/components/ui/block-btn";

export default function FormFinal(props) {
  const { setProgress, setCurrentStage } = props;

  return (
    <div className={styles.form} style={{ marginBottom: "100px" }}>
      <div className={styles.desc}>
        <h1>최종 제출 확인</h1>
        <p>제출 완료 후 성적 을 변경 하실 수 없습니다.</p>
      </div>
      <div className={styles.list}>
        <div className={styles.item}>
          <div className={styles.key}>어학점수</div>
          <div className={styles.value}>4.5</div>
        </div>
        <div className={styles.item}>
          <div className={styles.key}>대학교 성적</div>
          <div className={styles.value}>4.0/4.5</div>
        </div>
        <div className={styles.item}>
          <div className={styles.key}>어학 증명서</div>
          <div className={styles.valueFile}>
            <div>첨부 완료</div>
            <RoundBtn onClick={() => {}}>파일 변경하기</RoundBtn>
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.key}>성적 증명서</div>
          <div className={styles.valueFile}>
            <div>첨부 완료</div>
            <RoundBtn onClick={() => {}}>파일 변경하기</RoundBtn>
          </div>
        </div>
      </div>
    </div>
  );
}
