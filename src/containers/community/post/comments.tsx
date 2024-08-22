import Image from "next/image";

import { convertISODateToDateTime } from "@/utils/datetimeUtils";

import { IconSubComment } from "../../../../public/svgs";
import styles from "./comments.module.css";

import { Comment } from "@/types/community";

type CommentsProps = {
  comments: Comment[];
};

export default function Comments({ comments }: CommentsProps) {
  return (
    <div className={styles["comment-container"]}>
      {comments?.map((comment) => (
        <div
          className={`${styles["comment-wrapper"]} ${comment.parentId !== null && styles["comment-wrapper--sub-comment"]}`}
          key={comment.id}
        >
          {comment.parentId !== null && (
            <div className={styles["comment__sub-comment-icon"]}>
              <IconSubComment />
            </div>
          )}
          <div className={styles.comment}>
            <div className={styles.comment__author}>
              <div className={styles["comment__author-profile-image"]}>
                {comment.postFindSiteUserResponse.profileImageUrl && (
                  <Image src={comment.postFindSiteUserResponse.profileImageUrl} width={40} height={40} alt="alt" />
                )}
              </div>
              <div className={styles["comment__author-name"]}>{comment.postFindSiteUserResponse.nickname}</div>
            </div>
            <div className={styles.comment__content}>{comment.content}</div>
            <div className={styles["comment__created-at"]}>
              {convertISODateToDateTime(comment.createdAt) || "1970. 1. 1. 00:00"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
