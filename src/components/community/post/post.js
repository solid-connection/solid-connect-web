import Image from "next/image";

import Communication from "@/components/ui/icon/Communication";
import FavoriteOutlined from "@/components/ui/icon/FavoriteOutlined";

import styles from "./post.module.css";

export default function Post(props) {
  const { category, title, createdAt, content, images, favoriteCount, author, comments } = props;

  return (
    <>
      <div className={styles.post}>
        <div className={styles.category}>{category || "카테고리"}</div>
        <div className={styles.title}>{title || "제목 없음"}</div>
        <div className={styles.content}>{content || "내용 없음"}</div>
        <div className={styles.images}>
          {images && images.map((image) => <Image src={image} width={500} height={500} />)}
        </div>
        <div className={styles.icons}>
          <div>
            <FavoriteOutlined />
            <span>{favoriteCount || 0}</span>
          </div>
          <div>
            <Communication />
            <span>{comments ? comments.length : 0}</span>
          </div>
        </div>
      </div>

      <div className={styles.author}>
        <div className={styles.authorInfo}>
          <div className={styles.authorProfileImage}>
            {author.profileImage && <Image src={author.profileImage} width={40} height={40} />}
          </div>
          <div className={styles.authorText}>
            <div className={styles.authorName}>{author.name}</div>
            <div className={styles.createDate}>{createdAt}</div>
          </div>
        </div>
        <div>
          <button>채팅보내기</button>
        </div>
      </div>
    </>
  );
}
