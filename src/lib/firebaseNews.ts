import initializeFirebaseAdmin from "./firebaseAdmin";

import { News } from "@/types/news";

export async function fetchAllNews(): Promise<News[]> {
  try {
    const db = await initializeFirebaseAdmin();
    const snapshot = await db.collection("news").get();

    const newsItems = snapshot.docs
      .map((doc) => ({
        id: Number(doc.id),
        title: doc.data()?.title ?? "",
        description: doc.data()?.description ?? "",
        imageUrl: doc.data()?.imageUrl ?? "",
        url: doc.data()?.url ?? "",
      }))
      .sort((a, b) => a.id - b.id);

    return newsItems;
  } catch (error) {
    console.error("소식지를 불러오고 정렬하는 중 오류 발생:", error);
    throw error;
  }
}
