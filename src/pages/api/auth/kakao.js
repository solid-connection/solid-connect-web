export default async function handler(req, res) {
  // Authorization code를 받아서 백엔드로 전달, 백엔드에서 토큰을 받아옴
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  if (req.method === "POST") {
    const { code } = req.body;

    try {
      const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/kakao`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: code }),
      });
      // console.log("----------------");
      // console.log(backendResponse);

      if (!backendResponse.ok) {
        // 백엔드 응답 오류를 클라이언트에 전달
        return res.status(backendResponse.status).json({
          message: "Error sending code to backend",
        });
      }

      // 백엔드에서 받은 데이터를 클라이언트에 전달
      const json = await backendResponse.json();
      if (!json.success) {
        throw new Error("Authorization code로 인증 실패");
      }
      const data = json.data;

      if (data.registered) {
        // 기존 회원일 시
        const { accessToken, refreshToken } = data;
        res.setHeader("Set-Cookie", [
          `accessToken=${accessToken}; Domain=.solid-connect.net; Path=/; Secure; SameSite=Strict; Max-Age=3600`, // 1시간 만료
          `refreshToken=${refreshToken}; Domain=.solid-connect.net; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=604800`, // 7일 만료
        ]);
        return res.status(200).json({ success: true, registered: true });
      } else {
        // 새로운 회원일 시
        return res.status(200).json({ success: true, registered: false, data: { kakaoOauthToken: data.kakaoOauthToken, nickname: data.nickname, email: data.email, profileImageUrl: data.profileImageUrl } });
      }
    } catch (error) {
      // 네트워크 오류 처리
      return res.status(500).json({ message: error.message });
    }
  }
}
