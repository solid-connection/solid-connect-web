import React from "react";
import Image from "next/image";
import Link from "next/link";

import classes from "./university-card.module.css";
import CheveronRightFilled from "../ui/ChevronRightFilled";

function UniversityCard(props) {
  const { uuid, name, country, region, requirements } = props;

  return (
    <Link href={`/university/${uuid}`}>
      <div className={classes.card}>
        <img className={classes.image} src="" width={100} height={100} />
        <div className={classes.info}>
          <p className={classes.name}>{name}</p>
          <p className={classes.country}>
            {country} | {region}
          </p>
          <p className={classes.requirements}>{requirements}</p> {/* 토플 점수 표시 */}
        </div>
        <div className={classes.rightArrow}>
          <CheveronRightFilled />
        </div>
      </div>
    </Link>
  );
}

export default UniversityCard;
