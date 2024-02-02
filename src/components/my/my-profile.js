import Link from "next/link";

import styles from "./my-profile.module.css";
import EditFilled from "../ui/icon/EditFilled";

export default function MyProfile(props) {
  const { image, name, role, date, college, email } = props;
  return (
    <div className={styles.profile}>
      <div className={styles.imageWrapper}>
        <img src={image} alt="프로필 이미지" />
      </div>
      <div className={styles.info}>
        <div className={styles.name}>
          <div>{name}</div>
          <Link href="/my/modify">
            <EditFilled />
          </Link>
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
