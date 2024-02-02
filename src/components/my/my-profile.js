import EditFilled from "../ui/icon/EditFilled";
import styles from "./my-profile.module.css";

export default function MyProfile(props) {
  const { image, name, role, date, college, email } = props;
  return (
    <div className={styles.profile}>
      <div className={styles.imageWrapper}>
        <img src={image} alt="프로필 이미지" />
      </div>
      <div className={styles.info}>
        <div className={styles.name} onClick={() => {}}>
          <div>{name}</div>
          <EditFilled />
        </div>
        <div className={styles.subInfo}>
          <div className={styles.role}>{role}</div>
          <div className={styles.date}>{date}</div>
        </div>
        <div style={{ marginTop: "12px" }} className={styles.smText}>
          {college}
        </div>
        <div style={{ marginTop: "4px" }} className={styles.smText}>
          {email}
        </div>
      </div>
    </div>
  );
}
