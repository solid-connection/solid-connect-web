import BlockBtn from "@/components/button/block-btn";

import styles from "./form.module.css";

import { ListUniversity } from "@/types/university";

type CollegeFormScreenProps = {
  toNextStage: () => void;
  collegeId: number;
  setCollegeId: (value: number) => void;
  text: string;
  universityList: ListUniversity[];
};

const CollegeFormScreen = ({ toNextStage, collegeId, setCollegeId, text, universityList }: CollegeFormScreenProps) => {
  const handleSubmit = () => {
    // 입력 필드 유효성 검사
    if (collegeId === null) {
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
          <label>{text}</label>
          <select value={collegeId || ""} onChange={(e) => setCollegeId(parseInt(e.target.value, 10))}>
            <option value="">학교를 선택하세요.</option>
            {universityList.map((university) => (
              <option key={university.id} value={university.id}>
                [{university.region} - {university.country}]{university.koreanName}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles.blockBtns}>
        <BlockBtn style={{ backgroundColor: "var(--primary-2, #091F5B)" }} onClick={handleSubmit}>
          다음
        </BlockBtn>
      </div>
    </div>
  );
};

export default CollegeFormScreen;
