import styles from "./survey.module.css";

export default function Survey3(props) {
  const { setStage, preparation, setPreparation, submitSurvey, nickname, setNickname, profileImageUrl, setProfileImageUrl } = props;

  return (
    <>
      <div className={styles.survey3}>
        <div className={styles.profile}>
          <img src={profileImageUrl} className={styles.profileImage}></img>
          <div className={styles.nickname}>{nickname}</div>
          <div className={styles.info}>
            <div className={styles.birth}>2000.00.00</div>
            <div className={styles.gender}>성별</div>
          </div>
        </div>
        <div className={styles.choiceZone}>
          <div className={styles.choiceDesc}>현재 나의 준비 단계를 선택해주세요</div>
          <div className={styles.choices}>
            <div
              className={preparation === "CONSIDERING" ? styles.selectedChoice : ""}
              onClick={() => {
                setPreparation("CONSIDERING");
              }}
            >
              1단계 : 교환학생 지원 고민 상태
            </div>
            <div
              className={preparation === "PREPARING_FOR_DEPARTURE" ? styles.selectedChoice : ""}
              onClick={() => {
                setPreparation("PREPARING_FOR_DEPARTURE");
              }}
            >
              2단계 : 교환학생 합격 후 파견 준비 상태
            </div>
            <div
              className={preparation === "STUDYING_ABROAD" ? styles.selectedChoice : ""}
              onClick={() => {
                setPreparation("STUDYING_ABROAD");
              }}
            >
              3단계 : 해외 학교에서 공부중인 상태
            </div>
          </div>
        </div>
      </div>
      <button
        className={styles.btn}
        onClick={() => {
          submitSurvey();
        }}
      >
        <div>다음으로</div>
      </button>
    </>
  );
}
