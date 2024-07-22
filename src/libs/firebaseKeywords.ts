import admin from "firebase-admin";

import initializeFirebaseAdmin from "./firebaseAdmin";

export async function fetchPopularKeywords(): Promise<string[]> {
  const db = await initializeFirebaseAdmin();

  const snapshot = await db.collection("keywords").orderBy("count", "desc").limit(10).get();
  const keywords = snapshot.docs.map((doc) => doc.id);
  return keywords;
}

export async function saveSearchKeyword(keyword: string) {
  const db = await initializeFirebaseAdmin();

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
