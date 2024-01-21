import Link from "next/link";
import Image from "next/image";

import styles from "./home-college-card.module.css";

export default function HomeCollegeCard(props) {
  return (
    <Link href={`/college/${props.id}`}>
      <div className={styles.card}>
        <Image className={styles.image} src={props.image} width={153} height={120} />
        <div className={styles.name}>{props.name}</div>
      </div>
    </Link>
  );
}
