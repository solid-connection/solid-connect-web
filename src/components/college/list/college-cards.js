import styles from "./college-cards.module.css";
import CollegeCard from "./college-card";

export default function CollegeCards(props) {
  const { colleges } = props;
  return (
    <div className={styles.container}>
      {colleges.map((college) => (
        <CollegeCard key={college.id} {...college} />
      ))}
    </div>
  );
}
