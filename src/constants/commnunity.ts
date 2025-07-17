export enum CommunityBoard {
  FREE = "FREE",
  EUROPE = "EUROPE",
  AMERICAS = "AMERICAS",
  ASIA = "ASIA",
}

export const COMMUNITY_BOARD_NAMES = {
  [CommunityBoard.FREE]: "자유",
  [CommunityBoard.EUROPE]: "유럽권",
  [CommunityBoard.AMERICAS]: "미주권",
  [CommunityBoard.ASIA]: "아시아권",
};

export enum CommunityCategory {
  ALL = "전체",
  FREE = "자유",
  QUESTION = "질문",
}
