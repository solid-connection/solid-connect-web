export interface Board {
  name: string;
  koreanName: string;
}

export interface CommunityUser {
  id: number;
  nickname: string;
  profileImageUrl: string;
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
  createdAt: string;
  updatedAt: string;
  postFindBoardResponse: Board;
  postFindSiteUserResponse: CommunityUser;
  // postFindCommentResponses: Comment[];
  postFindPostImageResponses: PostImage[];
}

export interface PostImage {
  id: number;
  url: string;
}

export interface ListPost {
  id: number;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  url: string | null;
}

export interface PostCreateRequest {
  postCreateRequest: {
    postCategory: string;
    title: string;
    content: string;
    isQuestion: boolean;
  };
  files: File[];
}

export interface PostUpdateRequest {
  postUpdateRequest: {
    postCategory: string;
    title: string;
    content: string;
  };
  files: File[];
}

export interface PostIdResponse {
  id: number;
}
