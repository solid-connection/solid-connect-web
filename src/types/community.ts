export interface Board {
  name: string;
  koreanName: string;
}

export interface CommunityUser {
  id: number;
  nickname: string;
  profileImageUrl: string;
}

export interface Comment {
  id: number;
  parentId: number | null;
  content: string;
  isOwner: boolean;
  createdAt: string;
  updatedAt: string;
  postFindSiteUserResponse: CommunityUser;
}

export interface PostImage {
  id: number;
  url: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  isQuestion: boolean;
  likeCount: number;
  viewCount: number;
  commentCount: number;
  postCategory: string;
  isOwner: boolean;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
  postFindBoardResponse: Board;
  postFindSiteUserResponse: CommunityUser;
  postFindCommentResponses: Comment[];
  postFindPostImageResponses: PostImage[];
}

export interface ListPost {
  id: number;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  postCategory: string;
  url: string | null;
}

export interface PostCreateRequest {
  postCreateRequest: {
    postCategory: string;
    title: string;
    content: string;
    isQuestion: boolean;
  };
  file: Blob[];
}

export interface PostUpdateRequest {
  postUpdateRequest: {
    postCategory: string;
    title: string;
    content: string;
  };
  file: File[];
}

export interface CommentCreateRequest {
  content: string;
  parentId: number | null;
}

export interface PostIdResponse {
  id: number;
}

export interface CommentIdResponse {
  id: number;
}

export interface PostLikeResponse {
  likeCount: number;
  isLiked: boolean;
}
