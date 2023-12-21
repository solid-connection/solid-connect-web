import { Fragment } from "react";
import Image from "next/image";

import classes from "./college-detail.module.css";

function CollegeDetail(props) {
  const { image, name } = props;
  return (
    <div className={classes.wrapper}>
      {/* <Image src={image} alt={name} width={300} height={300} /> */}
      <img className={classes.image} src={image} alt={name} height={300} />
      <div className={classes.title}>{name}</div>
    </div>
  );
}

export default CollegeDetail;
