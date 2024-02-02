import styles from "./my-modify.module.css";

export default function MyModify(props) {
  const { name, image, role, gender, birthDate, originCollege, exchangeCollege } = props;
  return (
    <div className={styles.modify}>
      <div className={styles.profile}>
        <div className={styles.role}>{role}</div>
        <div className={styles.image}>
          <img src={image} alt="프로필 이미지" />
        </div>
      </div>
      <div className={styles.formContainer}>
        <div className={styles.form}>
          <div>이름</div>
          <div>{name}</div>
        </div>
        <div className={styles.form}>
          <div>성별</div>
          <div>{gender}</div>
        </div>
        <div className={styles.form}>
          <div>생년월일</div>
          <div>{birthDate}</div>
        </div>
        <div className={styles.form}>
          <div>출신학교</div>
          <div>{originCollege}</div>
        </div>
        <div className={styles.form}>
          <div>파견학교</div>
          <div>{exchangeCollege}</div>
        </div>
      </div>
    </div>
  );
}
