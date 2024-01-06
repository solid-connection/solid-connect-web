import styles from "./college-detail.module.css";

export default function CollegeDetail(props) {
  const { image, name } = props;
  return (
    <div className={styles.wrapper}>
      <img className={styles.image} src={image} alt={name} height={300} />
    </div>
  );
}
