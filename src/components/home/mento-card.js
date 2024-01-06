import Link from "next/link";
import Image from "next/image";

import styles from "./mento-card.module.css";
import CheveronRightFilled from "../ui/icon/ChevronRightFilled";

export default function MentoCard(props) {
  const { mentoId, image, name, country, university, period } = props;
  const url = `/mento/${mentoId}`;

  return (
    <Link href={url} className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image className={styles.image} src={image} alt={name} width={100} height={100} />
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <div className={styles.contentName}>
            <b>멘토</b> {name}
          </div>
          <div className={styles.contentRegion}>
            {country} | {university}
          </div>
          <div className={styles.contentPeriod}>{period}</div>
        </div>
        <CheveronRightFilled color="black" opacity="0.54" className={styles.contentIcon} />
      </div>
    </Link>
  );
}
