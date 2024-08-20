import { Dispatch, SetStateAction } from "react";

import BlockToggleBtn from "@/components/ui/block-toggle-btn";

import { IconPrepare1, IconPrepare2, IconPrepare3 } from "../../../../public/svgs";
import styles from "./signup.module.css";

import { MAX_WIDTH } from "@/constants/meta";
import { PreparationStatus } from "@/types/auth";

type SignupPrepareScreenProps = {
  preparation: PreparationStatus;
  setPreparation: Dispatch<SetStateAction<PreparationStatus>>;
  setStage: Dispatch<SetStateAction<number>>;
};

export default function SignupPrepareScreen({ preparation, setPreparation, setStage }: SignupPrepareScreenProps) {
  const toNextStage = () => {
    if (!preparation) {
      alert("준비 단계를 선택해주세요.");
      return;
    }
    setStage(2);
  };

  return (
    <div className={styles.screen}>
      <div className={styles["secondary-title"]}>솔리드 커넥션에 오신 것을 환영합니다.</div>
      <div className={styles["title"]}>
        현재 나의
        <span style={{ color: "#6F96D1" }}> 준비 단계</span>를<br />
        선택해주세요.
      </div>

      <div className={styles["prepare-screen"]}>
        <div className={styles["prepare-choices"]}>
          <button
            className={`${styles["prepare-choice"]} ${preparation === "CONSIDERING" ? styles["prepare-choice--selected"] : ""}`}
            onClick={() => setPreparation("CONSIDERING")}
          >
            <div className={styles["prepare-choice__icon"]}>
              <IconPrepare2 />
            </div>
            <div className={styles["prepare-choice__right"]}>
              <div className={styles["prepare-choice__description"]}>교환학생 지원을 고민중이신가요?</div>
              <div className={styles["prepare-choice__name"]}>고민 솔커 회원</div>
            </div>
          </button>

          <button
            className={`${styles["prepare-choice"]} ${preparation === "PREPARING_FOR_DEPARTURE" ? styles["prepare-choice--selected"] : ""}`}
            onClick={() => setPreparation("PREPARING_FOR_DEPARTURE")}
          >
            <div className={styles["prepare-choice__icon"]}>
              <IconPrepare1 />
            </div>
            <div className={styles["prepare-choice__right"]}>
              <div className={styles["prepare-choice__description"]}>교환학생 합격 후 준비중이신가요?</div>
              <div className={styles["prepare-choice__name"]}>준비 솔커 회원</div>
            </div>
          </button>

          <button
            className={`${styles["prepare-choice"]} ${preparation === "STUDYING_ABROAD" ? styles["prepare-choice--selected"] : ""}`}
            onClick={() => setPreparation("STUDYING_ABROAD")}
          >
            <div className={styles["prepare-choice__icon"]}>
              <IconPrepare3 />
            </div>
            <div className={styles["prepare-choice__right"]}>
              <div className={styles["prepare-choice__description"]}>이미 해외 학교에서 공부중이신가요?</div>
              <div className={styles["prepare-choice__name"]}>해외 솔커 회원</div>
            </div>
          </button>
        </div>
      </div>

      <BlockToggleBtn
        style={{
          position: "fixed",
          bottom: "50px",
          width: "calc(100% - 60px)",
          maxWidth: MAX_WIDTH - 60,
          marginLeft: "10px",
        }}
        onClick={toNextStage}
        isToggled={!!preparation}
      >
        다음으로
      </BlockToggleBtn>
    </div>
  );
}
