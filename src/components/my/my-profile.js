import styles from "./my-profile.module.css";

export default function MyProfile(props) {
  const { image, name, role, date, college, email } = props;
  return (
    <div className={styles.profile}>
      <div className={styles.imageWrapper}>
        <img className={styles.image} src={image} alt="프로필 이미지" />
      </div>
      <div className={styles.info}>
        <div className={styles.name}>{name}</div>
        <div className={styles.subInfo}>
          <div className={styles.role}>{role}</div>
          <div className={styles.date}>{date}</div>
        </div>
        <div className={styles.college}>{college}</div>
        <div className={styles.email}>{email}</div>
      </div>
    </div>
  );
}
