import Image from "next/image";
import { useState } from "react";

import { convertISODateToDateTime } from "@/utils/datetimeUtils";

import Communication from "@/components/ui/icon/Communication";
import FavoriteOutlined from "@/components/ui/icon/FavoriteOutlined";

import { IconCloseFilled } from "../../../../public/svgs";
import styles from "./post.module.css";

import { PostImage as PostImageType, Post as PostType } from "@/types/community";

export default function Post({ post }: { post: PostType }) {
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
        <div className={styles.category}>{post.postCategory || "카테고리"}</div>
        <div className={styles.title}>{post.title || "제목 없음"}</div>
        <div className={styles.content}>{post.content || "내용 없음"}</div>
        <div style={{ marginTop: "12px" }}>
          <PostImage images={post.postFindPostImageResponses} onImageClick={handleImageClick} />
        </div>
        {selectedImageIndex !== null && (
          <ImagePopup
            image={post.postFindPostImageResponses[selectedImageIndex]}
            title={`${selectedImageIndex + 1}/${post.postFindPostImageResponses.length}`}
            onClose={closePopup}
          />
        )}

        <div className={styles.icons}>
          <div>
            <FavoriteOutlined />
            <span>{post.likeCount || 0}</span>
          </div>
          <div>
            <Communication />
            <span>{post.commentCount || 0}</span>
          </div>
        </div>
      </div>

      <div className={styles.author}>
        <div className={styles.author__info}>
          <div className={styles["author__profile-image-wrapper"]}>
            {post.postFindSiteUserResponse && (
              <Image
                src={post.postFindSiteUserResponse.profileImageUrl}
                width={40}
                height={40}
                alt={post.postFindSiteUserResponse.nickname}
              />
            )}
          </div>
          <div className={styles.author__textzone}>
            <div className={styles.author__name}>{post.postFindSiteUserResponse.nickname || "작성자"}</div>
            <div className={styles["author__created-at"]}>
              {convertISODateToDateTime(post.createdAt) || "1970. 1. 1. 00:00"}
            </div>
          </div>
        </div>
        <div>
          <button>채팅보내기</button>
        </div>
      </div>
    </>
  );
}

function PostImage({ images, onImageClick }: { images: PostImageType[]; onImageClick: (index: number) => void }) {
  if (images.length === 1) {
    return (
      <div className={styles["single-image-container"]}>
        <div className={styles["single-image-wrapper"]}>
          <Image
            className={styles["single-image"]}
            src={images[0].url}
            layout="fill"
            objectFit="cover"
            alt="image"
            onClick={() => onImageClick(0)}
          />
        </div>
      </div>
    );
  }
  return (
    <div className={styles["image-scroll-container"]}>
      <div className={styles["image-scroll-content"]}>
        {images.map((image) => (
          <Image
            key={image.id}
            src={image.url}
            width={197}
            height={197}
            alt="image"
            onClick={() => onImageClick(image.id)}
          />
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
