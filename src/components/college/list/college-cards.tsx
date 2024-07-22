import Image from "next/image";
import Link from "next/link";

import { shortenLanguageTestName } from "@/utils/universityUtils";

import CheveronRightFilled from "../../ui/icon/ChevronRightFilled";
import styles from "./college-cards.module.css";

import { ListUniversity } from "@/types/university";

interface CollegeCardsProps {
  colleges: ListUniversity[];
  style?: React.CSSProperties;
}

export default function CollegeCards({ colleges, style }: CollegeCardsProps) {
  return (
    <div className={styles.container} style={style}>
      {colleges.map((college) => (
        <CollegeCard key={college.id} {...college} />
      ))}
    </div>
  );
}

export function CollegeCard({
  id,
  term,
  koreanName,
  region,
  country,
  logoImageUrl,
  studentCapacity,
  languageRequirements,
}: ListUniversity) {
  const convertedKoreanName = term !== process.env.NEXT_PUBLIC_CURRENT_TERM ? `${koreanName}(${term})` : koreanName;
  return (
    <Link className={styles.card} href={`/college/${id}`}>
      <div className={styles.centerAlign}>
        <Image
          className={styles.image}
          src={logoImageUrl}
          width={100}
          height={100}
          alt={convertedKoreanName || "이미지 없음"}
        />
      </div>

      <div className={styles.info}>
        <span className={styles.name}>{convertedKoreanName}</span>
        <div className={styles.spaceBetween}>
          <span className={styles.country}>
            {country} | {region}
          </span>
          <span className={styles.capacity}>모집 {studentCapacity}명</span>
        </div>
        <div className={styles.requirements}>
          {languageRequirements.slice(0, 3).map((requirement, index) => {
            return (
              <span key={index} className={styles.requirement}>
                {shortenLanguageTestName(requirement.languageTestType)}: {requirement.minScore}
              </span>
            );
          })}
        </div>
      </div>

      <div className={styles.rightArrowIcon}>
        <CheveronRightFilled color="black" opacity="0.54" />
      </div>
    </Link>
  );
}
