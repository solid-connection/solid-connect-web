import { fetchPopularKeywords, saveSearchKeyword } from "@/lib/firebaseKeywords";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // 검색어 저장
    const { keyword } = req.body;
    try {
      saveSearchKeyword(keyword);
      res.status(200).json({ message: "Keyword updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "GET") {
    // 인기 검색어 조회
    try {
      const keywords = await fetchPopularKeywords();
      res.status(200).json(keywords);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
