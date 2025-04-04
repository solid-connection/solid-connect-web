import Image from "next/image";
import Link from "next/link";

import CheveronRightFilled from "@/components/ui/icon/ChevronRightFilled";

import styles from "./mento-card.module.css";

type MentoCardProps = {
  mentoId: number;
  image: string;
  name: string;
  country: string;
  university: string;
  period: string;
};

const MentoCard = ({ mentoId, image, name, country, university, period }: MentoCardProps) => (
  <Link href={`/mento/${mentoId}`} className={styles.card}>
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

export default MentoCard;
