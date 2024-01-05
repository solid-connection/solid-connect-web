import Link from "next/link";

import styles from "./college-card.module.css";

import CheveronRightFilled from "../../ui/icon/ChevronRightFilled";

export default function CollegeCard(props) {
  const { uuid, name, country, region, requirements, capacity } = props;

  return (
    <Link className={styles.link} href={`/college/${uuid}`}>
      <div className={styles.card}>
        <div className={styles.flex}>
          <div className={styles.centerAlign}>
            <img className={styles.image} src="/images/boras-logo.png" width={100} height={100} />
          </div>
          <div className={styles.info}>
            <span className={styles.name}>{name}</span>
            <div className={styles.spaceBetween}>
              <span className={styles.country}>
                {country} | {region}
              </span>
              <span className={styles.capacity}>모집 {capacity}명</span>
            </div>
            <div className={styles.requirements}>
              {requirements.map((requirement) => {
                const key = Object.keys(requirement)[0];
                const value = requirement[key];
                return (
                  <span className={styles.requirement}>
                    {key} {value}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
        <div className={styles.centerAlign}>
          <div className={styles.rightArrowIcon}>
            <CheveronRightFilled color="black" opacity="0.54" />
          </div>
        </div>
      </div>
    </Link>
  );
}
