import { ListCollege } from "../../../types/college";
import { SHORT_LANGUAGE_TEST } from "../../../types/application";
import Link from "next/link";
import Image from "next/image";

import styles from "./college-cards.module.css";
import CheveronRightFilled from "../../ui/icon/ChevronRightFilled";

interface CollegeCardsProps {
  colleges: ListCollege[];
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

export function CollegeCard({ id, term, koreanName, region, country, logoImageUrl, studentCapacity, languageRequirements }: ListCollege) {
  const convertedKoreanName = term !== process.env.NEXT_PUBLIC_CURRENT_TERM ? `${koreanName}(${term})` : koreanName;
  return (
    <Link className={styles.card} href={`/college/${id}`}>
      <div className={styles.centerAlign}>
        <Image className={styles.image} src={logoImageUrl} width={100} height={100} alt={convertedKoreanName || "이미지 없음"} />
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
            let testType: string = "";
            if (SHORT_LANGUAGE_TEST.hasOwnProperty(requirement.languageTestType)) {
              testType = SHORT_LANGUAGE_TEST[requirement.languageTestType];
            } else {
              testType = requirement.languageTestType.replace(/_/g, " ");
            }
            return (
              <span key={index} className={styles.requirement}>
                {testType}: {requirement.minScore}
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
