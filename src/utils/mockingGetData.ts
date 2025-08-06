import { ChannelType, Mentor, MentorStudyStatus } from "@/types/mentor";

export const getMentorData = () => {
  const mentees: Mentor[] = [
    {
      id: 1,
      profileImageUrl: undefined,
      nickname: "윤솔거",
      country: "미국",
      universityName: "안양하세요 교환학생에 대해 무엇이든 물어보세요...",
      studyStatus: MentorStudyStatus.STUDYING,
      menteeCount: 0,
      hasBadge: false,
      introduction: "안녕하세요! 교환학생에 대해 무엇이든 물어보세요!",
      channels: [
        { type: ChannelType.BLOG, url: "https://blog.example.com" },
        { type: ChannelType.BRUNCH, url: "https://brunch.example.com" },
      ],
      isApplied: false,
    },
  ];
  return mentees;
};

export const getMentorListData = () => {
  const mentors: Mentor[] = [
    {
      id: 1,
      profileImageUrl: undefined,
      nickname: "김솔거너",
      country: "미국",
      universityName: "노스캐롤라이나 웨일런대학교(A성)",
      studyStatus: MentorStudyStatus.STUDYING,
      menteeCount: 7,
      hasBadge: true,
      introduction: "안녕하세요! 저는 미국 노스캐롤라이나 웨일런대학교에서 교환학생을 3년간 재학중인 김솔거너입니다!",
      channels: [
        { type: ChannelType.BLOG, url: "https://blog.example.com" },
        { type: ChannelType.BRUNCH, url: "https://brunch.example.com" },
      ],
      isApplied: false,
      time: "2023-10-01",
    },
    {
      id: 2,
      profileImageUrl: undefined,
      nickname: "박솔거너",
      country: "스웨덴",
      universityName: "보라스대학",
      studyStatus: MentorStudyStatus.SCHEDULED,
      menteeCount: 0,
      hasBadge: false,
      introduction: "안녕하세요! 스웨덴 교환학생입니다.",
      channels: [],
      isApplied: false,
      time: "2023-10-01",
    },
    {
      id: 3,
      profileImageUrl: undefined,
      nickname: "정솔거너",
      country: "독일",
      universityName: "푸르트바겐스마르크 경영실무대학교",
      studyStatus: MentorStudyStatus.COMPLETED,
      menteeCount: 7,
      hasBadge: true,
      introduction: "독일 교환학생 경험을 나누고 싶습니다.",
      channels: [],
      isApplied: false,
      time: "2023-10-01",
    },
  ];

  return mentors;
};

export const getMenteeListData = () => {
  const mentees: Mentor[] = [
    {
      id: 1,
      profileImageUrl: null,
      nickname: "윤솔거",
      country: "미국",
      universityName: "안양하세요 교환학생에 대해 무엇이든 물어보세요...",
      studyStatus: MentorStudyStatus,
      menteeCount: 0,
      hasBadge: false,
      introduction: "안녕하세요! 교환학생에 대해 무엇이든 물어보세요!",
      channels: [
        { type: ChannelType.BLOG, url: "https://blog.example.com" },
        { type: ChannelType.BRUNCH, url: "https://brunch.example.com" },
      ],
      isApplied: false,
      time: "2023-10-01-00-00",
    },
  ];
  return mentees;
};

export const getMyData = () => {
  const myData: Mentor = {
    id: 1,
    profileImageUrl: undefined,
    nickname: "윤솔거",
    country: "미국",
    universityName: "노스캐롤라이나 윌컴턴대학교(A형)",
    studyStatus: MentorStudyStatus.STUDYING,
    menteeCount: 0,
    hasBadge: false,
    introduction: "안녕하세요! 교환학생에 대해 무엇이든 물어보세요!",
    channels: [
      { type: ChannelType.BLOG, url: "https://blog.example.com" },
      { type: ChannelType.BRUNCH, url: "https://brunch.example.com" },
    ],
    isApplied: false,
  };
  return myData;
};
