import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import styles from "./home-college-cards.module.css";

import { ListUniversity } from "@/types/university";

export default function HomeCollegeCards({ colleges }: { colleges: ListUniversity[] }) {
  const containerRef = useRef(null);

  const handleWheel = (e) => {
    if (containerRef.current) {
      e.preventDefault(); // 기본 스크롤 동작 중지
      containerRef.current.scrollLeft += e.deltaY;
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.items}>
        {colleges.map((college) => (
          <HomeCollegeCard
            key={college.id}
            id={college.id}
            imageUrl={college.logoImageUrl ? college.logoImageUrl : ""}
            name={college.koreanName || "대학명"}
          />
        ))}
      </div>
    </div>
  );
}
type HomeCollegeCardProps = {
  id: number;
  imageUrl: string;
  name: string;
};

export function HomeCollegeCard({ id, imageUrl, name }: HomeCollegeCardProps) {
  return (
    <Link href={`/college/${id}`}>
      <div className={styles.card}>
        <div className={styles["image-wrapper"]}>
          <Image
            className="h-[120px]"
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${imageUrl}`}
            width={153}
            height={120}
            alt={name || "대학 없음"}
          />
        </div>
        <div className={styles.name}>{name}</div>
      </div>
    </Link>
  );
}
