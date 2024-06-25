import { fetchAllNews } from "@/libs/firebaseNews";

export async function getNewsList() {
  const newsList = await fetchAllNews();
  console.log(newsList);

  return { data: newsList };
}

export default async function handler(req, res) {
  const newsList = await getNewsList();
  if (req.method === "GET") {
    res.status(200).json(newsList);
  }
}
