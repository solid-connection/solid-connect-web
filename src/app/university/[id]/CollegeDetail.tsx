import Image from "next/image";

import styles from "./college-detail.module.css";

interface CollegeDetailProps {
  imageUrl: string;
}

const CollegeDetail = ({ imageUrl }: CollegeDetailProps) => (
  <div className={styles.wrapper}>
    <div className={styles.imageWrapper}>
      <Image
        className="h-full w-full object-cover"
        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${imageUrl}`}
        width={600}
        height={300}
        alt="학교 이미지"
      />
    </div>
  </div>
);

export default CollegeDetail;
