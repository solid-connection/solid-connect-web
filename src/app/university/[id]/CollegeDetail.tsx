import Image from "next/image";

import styles from "./college-detail.module.css";

type CollegeDetailProps = {
  name: string;
  imageUrl: string;
};

const CollegeDetail = ({ name, imageUrl }: CollegeDetailProps) => (
  <div className={styles.wrapper}>
    <div className={styles.imageWrapper}>
      <Image
        className={styles.image}
        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${imageUrl}`}
        alt={name}
        width={600}
        height={300}
      />
    </div>
  </div>
);

export default CollegeDetail;
