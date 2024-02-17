import Link from "next/link";
import Image from "next/image";

import styles from "./college-cards.module.css";
import CheveronRightFilled from "../../ui/icon/ChevronRightFilled";

interface CollegeCardsProps {
  colleges: College[];
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

interface College {
  id: string;
  koreanName: string;
  region: string;
  country: string;
  logoImageUrl: string;
  studentCapacity: number;
  languageRequirements: LanguageRequirement[];
}

interface LanguageRequirement {
  languageTestType: string;
  minScore: string;
}

export function CollegeCard({ id, koreanName, region, country, logoImageUrl, studentCapacity, languageRequirements }: College) {
  return (
    <Link className={styles.card} href={`/college/${id}`}>
      <div className={styles.centerAlign}>
        <Image className={styles.image} src={logoImageUrl} width={100} height={100} alt={koreanName || "이미지 없음"} />
      </div>

      <div className={styles.info}>
        <span className={styles.name}>{koreanName}</span>
        <div className={styles.spaceBetween}>
          <span className={styles.country}>
            {country} | {region}
          </span>
          <span className={styles.capacity}>모집 {studentCapacity}명</span>
        </div>
        <div className={styles.requirements}>
          {languageRequirements
            .map((requirement, index) => (
              <span key={index} className={styles.requirement}>
                {requirement.languageTestType.replace(/_/g, " ")}: {requirement.minScore}
              </span>
            ))
            .slice(0, 3)}
        </div>
      </div>

      <div className={styles.rightArrowIcon}>
        <CheveronRightFilled color="black" opacity="0.54" />
      </div>
    </Link>
  );
}
