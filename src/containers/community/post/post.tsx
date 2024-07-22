import Image from "next/image";

import Communication from "@/components/ui/icon/Communication";
import FavoriteOutlined from "@/components/ui/icon/FavoriteOutlined";

import styles from "./post.module.css";

export default function Post(props) {
  const { category, title, createdAt, content, favoriteCount, author, comments } = props;
  const images = [
    "https://solid-connection.s3.ap-northeast-2.amazonaws.com/original/university_of_guam/1.png",
    "https://solid-connection.s3.ap-northeast-2.amazonaws.com/original/university_of_guam/1.png",
    "https://solid-connection.s3.ap-northeast-2.amazonaws.com/original/university_of_guam/1.png",
    "https://solid-connection.s3.ap-northeast-2.amazonaws.com/original/university_of_guam/1.png",
    "https://solid-connection.s3.ap-northeast-2.amazonaws.com/original/university_of_guam/1.png",
    "https://solid-connection.s3.ap-northeast-2.amazonaws.com/original/university_of_guam/1.png",
    "https://solid-connection.s3.ap-northeast-2.amazonaws.com/original/university_of_guam/1.png",
    "https://solid-connection.s3.ap-northeast-2.amazonaws.com/original/university_of_guam/1.png",
    "https://solid-connection.s3.ap-northeast-2.amazonaws.com/original/university_of_guam/1.png",
    "https://solid-connection.s3.ap-northeast-2.amazonaws.com/original/university_of_guam/1.png",
  ];

  return (
    <>
      <div className={styles.post}>
        <div className={styles.category}>{category || "카테고리"}</div>
        <div className={styles.title}>{title || "제목 없음"}</div>
        <div className={styles.content}>{content || "내용 없음"}</div>
        <div style={{ marginTop: "12px" }}>
          <PostImage images={images} />
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
            {author?.profileImage && <Image src={author.profileImage} width={40} height={40} alt={"이후 수정 필요"} />}
          </div>
          <div className={styles.authorText}>
            <div className={styles.authorName}>{author?.name}</div>
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

function PostImage({ images }) {
  if (images.length === 0) {
    return null;
  }
  if (images.length === 1) {
    return <Image className={styles.image} src={images[0]} width={500} height={500} alt="alt" />;
  }
  return (
    <div className={styles["image-scroll-container"]}>
      <div className={styles["image-scroll-content"]}>
        {images.map((image) => (
          <Image src={image} width={197} height={197} alt="alt" />
        ))}
      </div>
    </div>
  );
}
