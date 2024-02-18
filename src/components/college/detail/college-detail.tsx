import Image from "next/image";

import styles from "./college-detail.module.css";

interface CollegeDetailProps {
  name: string;
  imageUrl: string;
}

export default function CollegeDetail({ name, imageUrl }: CollegeDetailProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.imageWrapper}>
        <Image className={styles.image} src={imageUrl} alt={name} width={600} height={300} />
      </div>
    </div>
  );
}
