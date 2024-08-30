import Image from "next/image";
import { useRouter } from "next/router";

import BlockBtn from "@/components/ui/block-btn";

import styles from "./form.module.css";

export default function CollegeFinalScreen() {
  const router = useRouter();
  return (
    <div className={styles.formWrapper}>
      <div className={styles.formCenter} style={{ marginTop: "160px" }}>
        <Image src="/images/survey-complete-icon.png" width={120} height={120} alt="지원 완료" />
        <h1 className={styles.h1Semibold}>지원 완료 !</h1>
        <p>48시간 이내에 성적 인증이 완료됩니다.</p>
      </div>
      <div className={styles.blockBtns}>
        <BlockBtn onClick={() => router.push("/score")}>성적 공유 현황 확인하기</BlockBtn>
        <BlockBtn onClick={() => router.push("/")} backgroundColor="var(--primary-2, #091F5B)">
          학교 지원 완료
        </BlockBtn>
      </div>
    </div>
  );
}
