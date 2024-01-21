import Image from "next/image";

import styles from "./college-detail.module.css";

export default function CollegeDetail(props) {
  const { image, name } = props;
  return (
    <div className={styles.wrapper}>
      <Image className={styles.image} src={image} alt={name} width={600} height={300} />
    </div>
  );
}
