import initializeFirebaseAdmin from "./firebaseAdmin";

import { News } from "@/types/news";

export async function fetchAllNews(): Promise<News[]> {
  const db = initializeFirebaseAdmin();

  // Firebase가 초기화되지 않은 경우 (CI 빌드 환경 등) 빈 배열 반환
  if (!db) {
    console.warn("Firebase is not initialized. Returning empty news list.");
    return [];
  }

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
}
