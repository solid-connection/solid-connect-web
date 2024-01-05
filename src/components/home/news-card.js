import styles from "./news-card.module.css";

export default function NewsCard(props) {
  return (
    <div className={styles.card}>
      <img className={styles.image} src={props.image} alt={props.title} />
      <div className={styles.title}>{props.title}</div>
    </div>
  );
}
