import { Dispatch, SetStateAction } from "react";

import BlockToggleBtn from "@/components/ui/block-toggle-btn";

import styles from "./signup.module.css";

import { MAX_WIDTH } from "@/constants/meta";
import { PreparationStatus } from "@/types/auth";

import { IconPrepare1, IconPrepare2, IconPrepare3 } from "@/public/svgs";

type SignupPrepareScreenProps = {
  preparation: PreparationStatus | null;
  setPreparation: Dispatch<SetStateAction<PreparationStatus>>;
  toNextStage: () => void;
};

export default function SignupPrepareScreen({ preparation, setPreparation, toNextStage }: SignupPrepareScreenProps) {
  const submit = () => {
    if (!preparation) {
      alert("준비 단계를 선택해주세요.");
      return;
    }
    toNextStage();
  };

  return (
    <div className={styles.screen}>
      <div className={styles["secondary-title"]}>솔리드 커넥션에 오신 것을 환영합니다.</div>
      <div className={styles.title}>
        현재 나의
        <span style={{ color: "#6F96D1" }}> 준비 단계</span>를<br />
        선택해주세요.
      </div>

      <div className={styles["prepare-screen"]}>
        <div className={styles["prepare-choices"]}>
          <button
            className={`${styles["prepare-choice"]} ${preparation === "CONSIDERING" ? styles["prepare-choice--selected"] : ""}`}
            onClick={() => setPreparation("CONSIDERING")}
            type="button"
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
            type="button"
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
            type="button"
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
        onClick={submit}
        isToggled={!!preparation}
      >
        다음으로
      </BlockToggleBtn>
    </div>
  );
}
