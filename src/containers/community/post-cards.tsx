import Image from "next/image";
import Link from "next/link";

import { convertISODateToDate } from "@/utils/datetimeUtils";

import Communication from "@/components/ui/icon/Communication";

import { IconPostLikeOutline } from "../../../public/svgs";
import styles from "./post-cards.module.css";

import { ListPost } from "@/types/community";

export default function PostCards({ posts, boardCode }: { posts: ListPost[]; boardCode: string }) {
  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} boardCode={boardCode} />
      ))}
    </div>
  );
}

export function PostCard({ post, boardCode }: { post: ListPost; boardCode: string }) {
  return (
    <Link href={`/community/${boardCode}/${post.id}`} className={styles.a}>
      <div className={styles.card}>
        <div className={styles.textZone}>
          <div className={styles.meta}>
            <div className={styles.category}>{post.postCategory || ""}</div>
            <div className={styles.date}>{convertISODateToDate(post.createdAt) || "1970. 1. 1."}</div>
          </div>
          <div className={styles.title}>{post.title || "제목 없음"}</div>
          <div className={styles.content}>{post.content || "내용 없음"}</div>
          <div className={styles.icons}>
            <div className={styles.favorite}>
              <IconPostLikeOutline />
              <span>{post.likeCount || 0}</span>
            </div>
            <div className={styles.comment}>
              <Communication />
              <span>{post.commentCount || 0}</span>
            </div>
          </div>
        </div>
        <div className={styles.imageZone}>
          {null && <Image src={null} height={82} width={82} alt={post.title || "이미지 없음"} />}
        </div>
      </div>
    </Link>
  );
}
