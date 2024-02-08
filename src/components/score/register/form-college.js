import styles from "./form.module.css";
import BlockBtn from "@/components/ui/block-btn";

export default function FromCollege(props) {
  const { toNextStage, college, setCollege, text } = props;

  const handleSubmit = () => {
    // 입력 필드 유효성 검사
    if (!college) {
      alert("대학을 입력해주세요.");
      return;
    }
    toNextStage();
  };

  return (
    <div className={styles.formWrapper}>
      <div className={styles.form} style={{ marginTop: "56px" }}>
        <h1 className={styles.h1Semibold}>
          파견 희망학교
          <br />
          선택하기
        </h1>
        <div className={styles.input}>
          <label htmlFor="college">{text}</label>
          <input type="text" id="college" value={college} placeholder="학교를 입력하세요." onChange={(e) => setCollege(e.target.value)} />
        </div>
      </div>
      <div className={styles.blockBtns}>
        <BlockBtn style={{ backgroundColor: "var(--primary-2, #091F5B)" }} onClick={handleSubmit}>
          다음
        </BlockBtn>
      </div>
    </div>
  );
}
