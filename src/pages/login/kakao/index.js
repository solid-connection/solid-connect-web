import KakaoLoginButton from "@/components/login/kakao-login-button";

export default function KakaoLoginPage() {
  function kakaoLogin() {
    window.Kakao.Auth.authorize({
      // redirectUri: "http://localhost:3000/login/kakao/callback",
      redirectUri: "https://solid-connect.net/login/kakao/callback",
    });
  }
  return (
    <div>
      <KakaoLoginButton onClick={kakaoLogin} />
    </div>
  );
}

// import React from "react";
// import KakaoLoginButton from "@/components/login/kakao-login-button";

// export default function KakaoLoginPage() {
//   const kakaoLogin = () => {
//     const REST_API_KEY = "b929e0134696bee489e7d9b9691161ba"; // 여기에 REST API 키를 입력하세요.
//     const REDIRECT_URI = "http://localhost:3000/login/kakao/callback";

//     const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

//     window.location.href = KAKAO_AUTH_URL;
//   };

//   return (
//     <div>
//       <KakaoLoginButton onClick={kakaoLogin} />
//     </div>
//   );
// }
