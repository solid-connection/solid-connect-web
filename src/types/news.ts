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
  updatedAt: string; // 또는 날짜 형식이 확실하다면 Date 타입도 가능합니다.
}

export enum ArticleDropdownType {
  EDIT = "수정하기",
  DELETE = "삭제하기",
}
