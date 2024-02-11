import styles from "./news-cards.module.css";

export default function NewsCards(props) {
  const { newsList } = props;

  return (
    <div className={styles.container}>
      {newsList.map((news) => (
        <NewsCard key={news.id} {...news} />
      ))}
    </div>
  );
}

export function NewsCard(props) {
  return (
    <a href={props.url} className={styles.card}>
      <img className={styles.image} src={props.imageUrl} alt={props.title} />
      <div className={styles.title}>{props.title}</div>
    </a>
  );
}
