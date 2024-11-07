// import db from "./firebaseConfig";
// import { collection, doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
// import { getDocs, query, orderBy, limit } from "firebase/firestore";

// export const saveSearchKeyword = async (keyword) => {
//   const keywordRef = await doc(db, "keywords", keyword);
//   const docSnap = await getDoc(keywordRef);

//   if (docSnap.exists()) {
//     // 문서가 이미 존재하면, count를 1 증가시킵니다.
//     await updateDoc(keywordRef, {
//       count: increment(1),
//       lastSearched: new Date(), // 현재 날짜와 시간으로 업데이트합니다.
//     });
//   } else {
//     // 문서가 존재하지 않으면, 새로운 문서를 추가합니다.
//     await setDoc(keywordRef, {
//       count: 1,
//       lastSearched: new Date(), // 현재 날짜와 시간으로 설정합니다.
//     });
//   }
// };

// export const getPopularKeywords = async (keyword) => {
//   const keywordsRef = collection(db, "keywords");
//   const q = query(keywordsRef, orderBy("count", "desc"), limit(10));

//   const querySnapshot = await getDocs(q);
//   const keywords = [];
//   querySnapshot.forEach((doc) => {
//     keywords.push(doc.id);
//   });
//   return keywords;
// };
