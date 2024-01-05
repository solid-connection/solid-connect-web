import NewsCard from "./news-card";

import styles from "./news-cards.module.css";

export default function NewsCards(props) {
  const { newsList } = props;

  return (
    <div className={styles.container}>
      {newsList.map((news) => (
        <NewsCard key={news.uuid} {...news} />
      ))}
    </div>
  );
}
