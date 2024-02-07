import styles from "./my-modify.module.css";

export default function MyModify(props) {
  const { nickname, profileImageUrl, role, gender, birth, originCollege, exchangeCollege } = props;
  const roleDisplay = {
    MENTO: "멘토",
    MENTEE: "멘티",
  };
  return (
    <div className={styles.modify}>
      <div className={styles.profile}>
        <div className={styles.role}>{role ? roleDisplay[role] : "멘티"}</div>
        <div className={styles.image}>
          <img src={profileImageUrl} alt="프로필 이미지" />
        </div>
      </div>
      <div className={styles.formContainer}>
        <div className={styles.form}>
          <div>이름</div>
          <div>{nickname || "이름"}</div>
        </div>
        <div className={styles.form}>
          <div>성별</div>
          <div>{gender || "미상"}</div>
        </div>
        <div className={styles.form}>
          <div>생년월일</div>
          <div>{birth.replace(/-/g, ". ")}</div>
        </div>
        <div className={styles.form}>
          <div>출신학교</div>
          <div>{originCollege || "인하대학교"}</div>
        </div>
        <div className={styles.form}>
          <div>파견학교</div>
          <div>{exchangeCollege}</div>
        </div>
      </div>
    </div>
  );
}
