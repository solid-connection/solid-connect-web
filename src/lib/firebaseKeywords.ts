import admin from "firebase-admin";

import initializeFirebaseAdmin from "./firebaseAdmin";

export async function fetchPopularKeywords(): Promise<string[]> {
  const db = initializeFirebaseAdmin();

  // Firebase가 초기화되지 않은 경우 빈 배열 반환
  if (!db) {
    console.warn("Firebase is not initialized. Returning empty keywords.");
    return [];
  }

  const snapshot = await db.collection("keywords").orderBy("count", "desc").limit(10).get();
  const keywords = snapshot.docs.map((doc) => doc.id);
  return keywords;
}

export async function saveSearchKeyword(keyword: string) {
  const db = initializeFirebaseAdmin();

  // Firebase가 초기화되지 않은 경우 무시
  if (!db) {
    console.warn("Firebase is not initialized. Skipping keyword save.");
    return;
  }

  const keywordRef = db.collection("keywords").doc(keyword);
  const docSnap = await keywordRef.get();

  if (docSnap.exists) {
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
}
