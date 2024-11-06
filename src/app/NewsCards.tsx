import Image from "next/image";

import styles from "./news-cards.module.css";

import { News } from "@/types/news";

type NewsCardsProps = {
  newsList: News[];
};

const NewsCards = ({ newsList }: NewsCardsProps) => {
  return (
    <div className={styles.container}>
      {newsList.map((news) => (
        <NewsCard key={news.id} news={news} />
      ))}
    </div>
  );
};

export default NewsCards;

type NewsCardProps = {
  news: News;
};

const NewsCard = ({ news }: NewsCardProps) => {
  return (
    <a target="_blank" href={news.url} rel="noreferrer">
      <div className={styles.card}>
        <Image className={styles.image} src={news.imageUrl} alt={news.title} width={170} height={90} />
        <div className={styles.card__right}>
          <div className={styles.title}>{news.title}</div>
          <div className={styles.description}>{news.description}</div>
        </div>
      </div>
    </a>
  );
};
