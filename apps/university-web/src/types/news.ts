export interface News {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  url: string;
}

export interface Article {
  id: number;
  title: string;
  /** 최대 30자, 멘토 자신이 작성 */
  description: string;
  url: string;
  thumbnailUrl: string;
  updatedAt: string;

  likeCount?: number;
  isLiked?: boolean; // API 응답의 `isLike`를 `isLiked`로 네이밍 컨벤션에 맞춰 변경하는 것을 추천
}

export enum ArticleDropdownType {
  EDIT = "수정하기",
  DELETE = "삭제하기",
}
