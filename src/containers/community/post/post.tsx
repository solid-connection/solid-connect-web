import Image from "next/image";
import { useState } from "react";

import Communication from "@/components/ui/icon/Communication";
import FavoriteOutlined from "@/components/ui/icon/FavoriteOutlined";

import { IconCloseFilled } from "../../../../public/svgs";
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

  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  const closePopup = () => {
    setSelectedImageIndex(null);
  };

  return (
    <>
      <div className={styles.post}>
        <div className={styles.category}>{category || "카테고리"}</div>
        <div className={styles.title}>{title || "제목 없음"}</div>
        <div className={styles.content}>{content || "내용 없음"}</div>
        <div style={{ marginTop: "12px" }}>
          <PostImage images={images} onImageClick={handleImageClick} />
        </div>
        {selectedImageIndex !== null && (
          <ImagePopup
            image={images[selectedImageIndex]}
            title={`${selectedImageIndex + 1}/${images.length}`}
            onClose={closePopup}
          />
        )}

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
        <div className={styles.author__info}>
          <div className={styles["author__profile-image-wrapper"]}>
            {author?.profileImage && <Image src={author.profileImage} width={40} height={40} alt={"이후 수정 필요"} />}
          </div>
          <div className={styles.author__textzone}>
            <div className={styles.author__name}>{author?.name || "작성자"}</div>
            <div className={styles["author__created-at"]}>{createdAt || "1970. 1. 1. 00:00"}</div>
          </div>
        </div>
        <div>
          <button>채팅보내기</button>
        </div>
      </div>
    </>
  );
}

function PostImage({ images, onImageClick }) {
  if (images.length === 1) {
    return (
      <Image
        className={styles.image}
        src={images[0]}
        width={500}
        height={500}
        alt="image"
        onClick={() => onImageClick(0)}
      />
    );
  }
  return (
    <div className={styles["image-scroll-container"]}>
      <div className={styles["image-scroll-content"]}>
        {images.map((image, index) => (
          <Image key={index} src={image} width={197} height={197} alt="image" onClick={() => onImageClick(index)} />
        ))}
      </div>
    </div>
  );
}

function ImagePopup({ image, title, onClose }) {
  return (
    <div className={styles["fullscreen-popup"]}>
      <div className={styles.popup__header}>
        <button className={styles["popup__close-button"]} onClick={onClose}>
          <IconCloseFilled />
        </button>
        <span className={styles.popup__title}>{title}</span>
        <div></div>
      </div>
      <div className={styles["popup__image-container"]}>
        <Image src={image} layout="fill" objectFit="contain" alt="Popup" />
      </div>
    </div>
  );
}
