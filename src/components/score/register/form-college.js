import styles from "./form.module.css";
import BlockBtn from "@/components/ui/block-btn";

export default function FromCollege(props) {
  const { toNextStage, college, setCollege, text, collegesKeyName } = props;

  const handleSubmit = () => {
    // 입력 필드 유효성 검사
    if (!college) {
      alert("대학을 선택해주세요.");
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
          <select id="college" value={college} onChange={(e) => setCollege(e.target.value)}>
            <option value="">학교를 선택하세요.</option>
            {Object.keys(collegesKeyName).map((key) => {
              return (
                <option key={key} value={key}>
                  {collegesKeyName[key]}
                </option>
              );
            })}
          </select>
          {/* <input type="text" id="college" value={college} placeholder="학교를 입력하세요." onChange={(e) => setCollege(e.target.value)} /> */}
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
