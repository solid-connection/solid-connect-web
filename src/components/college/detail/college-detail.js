import Image from "next/image";

import styles from "./college-detail.module.css";

export default function CollegeDetail(props) {
  const { imageUrl, name } = props;
  return (
    <div className={styles.wrapper}>
      <div className={styles.imageWrapper}>
        <Image className={styles.image} src={imageUrl} alt={name} width={600} height={300} />
      </div>
    </div>
  );
}
