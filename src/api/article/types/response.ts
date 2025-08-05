export interface ArticleResponse {
  title: string;
  description: string; // 최대 30자, 멘토가 작성
  url: string;
  thumbnailUrl: string;
  updatedAt: string;
  isLiked: boolean;
}
