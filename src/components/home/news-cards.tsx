import Image from "next/image";

import styles from "./news-cards.module.css";

import { News } from "@/types/news";

export default function NewsCards(props) {
  const { newsList }: { newsList: News[] } = props;

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
        <Image className={styles.image} src={props.imageUrl} alt={props.title} width={170} height={90} />
        <div className={styles.card__right}>
          <div className={styles.title}>{props.title}</div>
          <div className={styles.description}>{props.description}</div>
        </div>
      </div>
    </a>
  );
}
