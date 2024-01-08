import styles from "./college-list.module.css";
import CollegeCard from "./college-card";

export default function CollegeList(props) {
  const { colleges } = props;
  return (
    <div className={styles.container}>
      {colleges.map((college) => (
        <CollegeCard key={college.id} {...college} />
      ))}
    </div>
  );
}
