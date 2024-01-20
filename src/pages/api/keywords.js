import db from "./firebase/firebaseAdmin";
// import { increment } from "firebase-admin/firestore";
import admin from "firebase-admin";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // 검색어 저장
    const { keyword } = req.body;
    const keywordRef = db.collection("keywords").doc(keyword);
    try {
      const docSnap = await keywordRef.get();

      if (docSnap.exists) {
        console.log("exists");
        await keywordRef.update({
          count: admin.firestore.FieldValue.increment(1),
          lastSearched: new Date(),
        });
      } else {
        await keywordRef.set({
          count: 1,
          lastSearched: new Date(),
        });
      }
      res.status(200).json({ message: "Keyword updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "GET") {
    // 인기 검색어 조회
    try {
      const snapshot = await db.collection("keywords").orderBy("count", "desc").limit(10).get();

      const keywords = snapshot.docs.map((doc) => doc.id);
      res.status(200).json(keywords);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
