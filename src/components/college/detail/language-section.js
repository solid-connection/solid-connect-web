import styles from "./language-section.module.css";

export default function LanguageSection(props) {
  const { languageRequirements } = props;
  return (
    <>
      <div className={styles.bar}>
        {languageRequirements.ibt && <div>TOEFL IBT {languageRequirements.ibt}</div>}
        {languageRequirements.itp && <div>TOEFL ITP {languageRequirements.itp}</div>}
        {languageRequirements.toeic && <div>TOEIC {languageRequirements.toeic}</div>}
        {languageRequirements.ielts && <div>IELTS {languageRequirements.ielts}</div>}
        {languageRequirements.hsk && <div>신HSK {languageRequirements.hsk}</div>}
        {languageRequirements.jlpt && <div>JLPT {languageRequirements.jlpt}</div>}
        {languageRequirements.etc && <div>{languageRequirements.etc}</div>}
      </div>
      <div className={styles.section}>
        <div className={styles.title} style={{ marginTop: "16px" }}>
          어학 세부요건
        </div>
        <p>
          - Department of Humanities, Social Science, Business Administration and Economics 수강요건: 독일어 공인성적 B2 레벨 이상의 증빙 필수, Department of Natural Science 수강요건: 독일어 공인성적 B1 레벨 이상 증빙 필수
          <br />
          <br />- John F Kennedy Institute for North American Studies 수강요건: 영어 공인성적 C1 레벨 이상의 증빙 필수
        </p>
      </div>
    </>
  );
}
