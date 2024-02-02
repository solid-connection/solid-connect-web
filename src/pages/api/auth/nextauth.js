// import NextAuth from "next-auth";
// import Providers from "next-auth/providers";

// export default NextAuth({
//   providers: [
//     Providers.Credentials({
//       name: "Kakao",
//       credentials: {
//         code: { label: "Code", type: "text" },
//       },
//       authorize: async (credentials) => {
//         const body = {
//           code: credentials.code,
//           // 여기에 카카오 로그인을 처리하기 위한 추가적인 데이터가 필요하다면 추가
//         };
//         const res = await fetch("http://api.solid-connect.net/auth/kakao", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(body),
//         });
//         const user = await res.json();

//         if (res.ok && user) {
//           return {
//             id: user.id,
//             name: user.name,
//             email: user.email,
//             accessToken: user.accessToken,
//             refreshToken: user.refreshToken,
//           };
//         } else {
//           throw new Error("Authentication failed");
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     jwt: async ({ token, user }) => {
//       if (user) {
//         token.accessToken = user.accessToken;
//         token.refreshToken = user.refreshToken;
//       }
//       return token;
//     },
//     session: async ({ session, token }) => {
//       session.accessToken = token.accessToken;
//       session.refreshToken = token.refreshToken;
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/auth/signin", // 로그인 페이지 경로 설정
//     // 여기에 회원가입 페이지 경로도 설정할 수 있습니다.
//     newUser: "/auth/signup", // 새로운 사용자(회원가입) 페이지 경로
//   },
// });
