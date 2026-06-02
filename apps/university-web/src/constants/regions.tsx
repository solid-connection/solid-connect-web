import {
  IconSignupRegionAmerica,
  IconSignupRegionAsia,
  IconSignupRegionEurope,
  IconSignupRegionWorld,
} from "@/public/svgs";

export interface RegionData {
  name: string;
  icon: React.ReactNode;
  countries: string[];
}

export const regionList: RegionData[] = [
  {
    name: "미주권",
    icon: <IconSignupRegionAmerica />,
    countries: ["미국", "캐나다", "호주", "브라질"],
  },
  {
    name: "아시아권",
    icon: <IconSignupRegionAsia />,
    countries: [
      "말레이시아",
      "브루나이",
      "싱가포르",
      "아제르바이잔",
      "인도네시아",
      "일본",
      "키르기스스탄",
      "튀르키예",
      "홍콩",
      "중국",
      "대만",
      "카자흐스탄",
      "이스라엘",
    ],
  },
  {
    name: "유럽권",
    icon: <IconSignupRegionEurope />,
    countries: [
      "네덜란드",
      "노르웨이",
      "덴마크",
      "독일",
      "리투아니아",
      "리히텐슈타인",
      "스웨덴",
      "스위스",
      "스페인",
      "오스트리아",
      "체코",
      "포르투갈",
      "폴란드",
      "프랑스",
      "핀란드",
      "러시아",
    ],
  },
  {
    name: "아직 잘 모르겠어요",
    icon: <IconSignupRegionWorld />,
    countries: [],
  },
];

// 멘토 신청용 (아직 잘 모르겠어요 제외)
export const mentorRegionList = regionList.filter((region) => region.name !== "아직 잘 모르겠어요");
