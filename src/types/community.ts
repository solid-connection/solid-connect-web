export interface Board {
  name: string;
  postCount: number;
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
  createAt: string;
  updatedAt: string;
  postFindBoardResponse: Board;
  postFindSiteUserResponse: CommunityUser;
  // postFindCommentResponses: Comment[];
  postFindPostImageResponses: {
    id: number;
    url: string;
  }[];
}
