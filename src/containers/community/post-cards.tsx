import Image from "next/image";
import Link from "next/link";

import Communication from "@/components/ui/icon/Communication";
import FavoriteOutlined from "@/components/ui/icon/FavoriteOutlined";

import styles from "./post-cards.module.css";

export default function PostCards(props) {
  const { posts } = props;
  return (
    <div style={props.style}>
      {posts.map((post) => (
        <PostCard key={post.id} {...post} />
      ))}
    </div>
  );
}

export function PostCard(props) {
  const { id, title, content, category, date, favoriteCount, commentCount, image } = props;
  return (
    <Link href="/community/post/1" className={styles.a}>
      <div className={styles.card}>
        <div className={styles.textZone}>
          <div className={styles.meta}>
            <div className={styles.category}>{category || "일반"}</div>
            <div className={styles.date}>{date || "0000. 0. 0."}</div>
          </div>
          <div className={styles.title}>{title || "제목 없음"}</div>
          <div className={styles.content}>{content || "내용 없음"}</div>
          <div className={styles.icons}>
            <div className={styles.favorite}>
              <FavoriteOutlined />
              <span>{favoriteCount || 0}</span>
            </div>
            <div className={styles.comment}>
              <Communication />
              <span>{commentCount || 0}</span>
            </div>
          </div>
        </div>
        <div className={styles.imageZone}>
          {image && <Image src={image} height={82} width={82} alt={title || "이미지 없음"} />}
        </div>
      </div>
    </Link>
  );
}
