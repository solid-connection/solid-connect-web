import Image from "next/image";
import { useState } from "react";

import { deleteCommentApi } from "@/services/community";
import { convertISODateToDateTime } from "@/utils/datetimeUtils";

import Dropdown from "@/components/ui/dropdown";

import styles from "./comments.module.css";

import { Comment } from "@/types/community";

import { IconMoreVertFilled, IconSubComment } from "@/public/svgs";

type CommentsProps = {
  comments: Comment[];
  postId: number;
  refresh: () => void;
  setCurSelectedComment: React.Dispatch<React.SetStateAction<number | null>>;
};

export default function Comments({ comments, postId, refresh, setCurSelectedComment }: CommentsProps) {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const toggleDeleteComment = (commentId: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    deleteCommentApi(postId, commentId)
      .then(() => {
        refresh();
      })
      .catch((err) => {
        if (err.response) {
          console.error("Axios response error", err.response);
          if (err.response.status === 401 || err.response.status === 403) {
            alert("로그인이 필요합니다");
            document.location.href = "/login";
          } else {
            alert(err.response.data?.message);
          }
        } else {
          console.error("Error", err.message);
          alert(err.message);
        }
      });
  };

  const toggleDropdown = (commentId: number) => {
    setActiveDropdown(activeDropdown === commentId ? null : commentId);
  };

  return (
    <div className={styles["comment-container"]}>
      {comments?.map((comment) => (
        // eslint-disable-next-line
        <div
          className={`${styles["comment-wrapper"]} ${comment.parentId !== null && styles["comment-wrapper--sub-comment"]}`}
          key={comment.id}
          onClick={() => {
            if (comment.parentId === null) setCurSelectedComment(comment.id);
            else {
              setCurSelectedComment(comment.parentId);
            }
          }}
        >
          {comment.parentId !== null && (
            <div className={styles["comment__sub-comment-icon"]}>
              <IconSubComment />
            </div>
          )}
          <div className={styles.comment}>
            <div className={styles["comment__first-row"]}>
              <div className={styles.comment__author}>
                <div className={styles["comment__author-profile-image"]}>
                  {comment.postFindSiteUserResponse.profileImageUrl && (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${comment.postFindSiteUserResponse.profileImageUrl}`}
                      width={40}
                      height={40}
                      alt="alt"
                    />
                  )}
                </div>
                <div className={styles["comment__author-name"]}>{comment.postFindSiteUserResponse.nickname}</div>
              </div>
              {comment.isOwner && (
                <div className={styles["comment__kebab-menu-wrapper"]}>
                  <button
                    className={styles["comment__kebab-menu"]}
                    onClick={() => toggleDropdown(comment.id)}
                    type="button"
                    aria-label="더보기"
                  >
                    <IconMoreVertFilled />
                  </button>
                  {activeDropdown === comment.id && (
                    <Dropdown
                      options={[
                        {
                          label: "삭제하기",
                          action: () => {
                            toggleDeleteComment(comment.id);
                          },
                        },
                      ]}
                    />
                  )}
                </div>
              )}
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
