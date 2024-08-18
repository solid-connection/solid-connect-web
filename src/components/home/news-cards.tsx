import Image from "next/image";

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
    <a target="_blank" href={props.url}>
      <div className={styles.card}>
        <Image className={styles.image} src={props.imageUrl} alt={props.title} width={180} height={120} />
        <div className={styles.card__right}>
          <div className={styles.title}>{props.title}</div>
          <div className={styles.description}>{props.description}</div>
        </div>
      </div>
    </a>
  );
}
