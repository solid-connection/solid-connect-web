interface News {
  id: number;
  imageUrl: string;
  url: string;
  title: string;
}

export async function getNewsList() {
  const newsList: News[] = [{ id: 1, imageUrl: "/images/news/1.jpeg", url: "https://blog.naver.com/yoon144950/223349958663", title: "교환학생 해외 대학 학점 인정은 어떻게 받아요?" }];

  return { data: newsList };
}

export default async function handler(req, res) {
  const newsList = await getNewsList();
  if (req.method === "GET") {
    res.status(200).json(newsList);
  }
}
