import Image from "next/image";
import { useRouter } from "next/router";

import BlockBtn from "@/components/ui/block-btn";

import styles from "./form.module.css";

export default function CertFinalScreen() {
  const router = useRouter();
  return (
    <div className={styles.formWrapper}>
      <div className={styles.formCenter} style={{ marginTop: "160px" }}>
        <Image src="/images/survey-complete-icon.png" width={120} height={120} alt="지원 완료" />
        <h1 className={styles.h1Semibold}>제출 완료 !</h1>
        <p>48시간 이내에 성적 인증이 완료됩니다. 파견 희망 대학을 지원해주세요.</p>
      </div>
      <div className={styles.blockBtns}>
        <BlockBtn onClick={() => router.push("/score")}>성적 공유 현황 확인하기</BlockBtn>
        <BlockBtn onClick={() => router.push("/score/college-register")} backgroundColor="var(--primary-2, #091F5B)">
          학교 지원하러 가기
        </BlockBtn>
      </div>
    </div>
  );
}
