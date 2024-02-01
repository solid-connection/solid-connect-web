import Link from "next/link";
import Image from "next/image";

import styles from "./home-college-card.module.css";

export default function HomeCollegeCard(props) {
  const { id, image, name } = props;
  return (
    <Link href={`/college/${id}`}>
      <div className={styles.card}>
        <Image className={styles.image} src={image} width={153} height={120} alt={name || "대학 없음"} />
        <div className={styles.name}>{name}</div>
      </div>
    </Link>
  );
}
