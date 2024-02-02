import styles from "./survey.module.css";

export default function Survey3(props) {
  const { setStage, region, setRegion, country, setCountry, preparation, setPreparation, submitSurvey } = props;
  return (
    <div>
      <button
        className={styles.btn}
        onClick={() => {
          submitSurvey();
        }}
      >
        <div>다음으로</div>
      </button>
    </div>
  );
}
