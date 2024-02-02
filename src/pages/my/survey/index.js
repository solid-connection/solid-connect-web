// import { useRouter, useState } from "next/router";

// export default function initialSurveyPage(props) {
//   const router = useRouter();
//   const isLoggedIn = true;
//   // 비 로그인 상태라면
//   if (!isLoggedIn) {
//     if (typeof window !== "undefined") {
//       router.push("/login"); // 클라이언트 측에서만 실행
//     }
//     return <p>Loading...</p>;
//   }

//   return (
//     <div>
//       <h1>Q1</h1>
//       <h1>어느지역에 관심이 있으신가요?</h1>
//       {/* 설문조사 관련 컴포넌트 또는 내용 */}
//       <p>어떤 지역에 가장 관심이 많으신가요?</p>
//       {/* 여기에 설문조사 옵션을 렌더링 */}
//     </div>
//   );
// }
