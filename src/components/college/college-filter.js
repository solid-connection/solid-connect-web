import classes from "./college-filter.module.css";

function CollegeFilter() {
  return (
    <div className={classes.wrapper}>
      <div className={classes.selectWrapper}>
        <select className={classes.select}>
          <option value="all">필터</option>
          <option value="">필터2</option>
          <option value="">필터3</option>
          <option value="">필터4</option>
        </select>
      </div>
    </div>
  );
}

export default CollegeFilter;
