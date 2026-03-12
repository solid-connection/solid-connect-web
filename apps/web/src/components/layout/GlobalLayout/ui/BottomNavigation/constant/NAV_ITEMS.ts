export enum NavIconType {
  UNIVERSITY = "university",
  COMMUNITY = "community",
  HOME = "home",
  MENTOR = "mentor",
  MY = "my",
}
export const NAV_ITEMS = [
  { route: "/university", text: "학교", iconType: NavIconType.UNIVERSITY },
  { route: "/community", text: "커뮤니티", iconType: NavIconType.COMMUNITY },
  { route: "/", text: "홈", iconType: NavIconType.HOME },
  { route: "/mentor", text: "멘토", iconType: NavIconType.MENTOR },
  { route: "/my", text: "마이", iconType: NavIconType.MY },
] as const;
