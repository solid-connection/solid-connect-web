interface News {
  id: number;
  title: string;
  imageUrl: string;
  url: string;
}

export async function getNewsList() {
  const newsList: News[] = [
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
