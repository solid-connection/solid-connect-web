import { News } from "@/types/news";

export async function getNewsList() {
  const newsList: News[] = [
    { id: 11, title: "혼자 독일 입국하기? 모두 할 수 있다  ", imageUrl: "/images/news/11.png", url: "https://youtu.be/uxmNlJHXyuI?si=RvToYXLi_Dmg0zav" },
    { id: 10, title: "독일 기차 예약 꿀팁, 독일 입국하는 방법 ", imageUrl: "/images/news/10.png", url: "https://youtu.be/ZL6jcHOsOws?si=E9WbxD9LfNq4Qy34" },
    { id: 9, title: "독일 대학교 캠퍼스는 어떨까? ", imageUrl: "/images/news/9.png", url: "https://youtu.be/nosXCMXSunc?si=2njdeQyTdcVtH68i" },
    { id: 8, title: "다이소로 끝! 교환학생 준비물", imageUrl: "/images/news/8.png", url: "https://youtu.be/EnUd9EmguOI?si=TLcpAZ6TrX2HJH6N" },
    { id: 7, title: "교환학생 출국 전 브이로그", imageUrl: "/images/news/7.png", url: "https://youtu.be/CuKF1zUNTqs?si=ybIPBVGDV6EgmVIt" },
    { id: 6, title: "독일에 대한 기초 지식", imageUrl: "/images/news/6.png", url: "https://blog.naver.com/yoon144950/223359192982" },
    { id: 5, title: "교환학생 합격, 수학계획서는 정말 안 중요할까요?", imageUrl: "/images/news/5.png", url: "https://blog.naver.com/yoon144950/223359719803" },
    { id: 4, title: "일리노이 대학교 공과대학 B형 정현수님 인터뷰", imageUrl: "/images/news/4.png", url: "https://blog.naver.com/yoon144950/223357293186" },
    { id: 3, title: "[스웨덴 교환학생] 인하대 교환학생 출국준비 Time line", imageUrl: "/images/news/3.png", url: "https://blog.naver.com/a996600/223265965232" },
    { id: 2, title: "교환학생 회고록", imageUrl: "/images/news/2.png", url: "https://yonsodev.tistory.com/m/90" },
    { id: 1, title: "교환학생 해외 대학 학점 인정은 어떻게 받아요?", imageUrl: "/images/news/1.jpeg", url: "https://blog.naver.com/yoon144950/223349958663" },
  ];

  return { data: newsList };
}

export default async function handler(req, res) {
  const newsList = await getNewsList();
  if (req.method === "GET") {
    res.status(200).json(newsList);
  }
}
