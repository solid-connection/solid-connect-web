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
            image={college.logoImageUrl ? college.logoImageUrl : ""}
            name={college.koreanName || "대학명"}
          />
        ))}
      </div>
    </div>
  );
}

export function HomeCollegeCard(props) {
  const { id, image, name } = props;
  return (
    <Link href={`/college/${id}`}>
      <div className={styles.card}>
        <div className={styles.imageWrapper}>
          <Image src={image} width={153} height={120} alt={name || "대학 없음"} />
        </div>
        <div className={styles.name}>{name}</div>
      </div>
    </Link>
  );
}
