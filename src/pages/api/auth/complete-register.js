export async function completeRegister(kakaoOauthToken, interestedRegions, interestedCountries, preparationStatus, nickname, profileImageUrl) {}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { kakaoOauthToken, interestedRegions, interestedCountries, preparationStatus, nickname, profileImageUrl, gender, birth } = req.body;

    try {
      const backendResponse = await fetch(`${process.env.API_SERVER_URL}/auth/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kakaoOauthToken: kakaoOauthToken,
          interestedRegions: ["아시아권", "유럽권"],
          interestedCountries: ["싱가포르", "오스트리아"],
          preparationStatus: "CONSIDERING",
          nickname: "닉네임1",
          profileImageUrl: "http://k.kakaocdn.net/dn/Vu7Ns/btszpzg5KD6/ChzJDcvSxWeZ93VX2AelD0/img_640x640.jpg",
          gender: "FEMALE",
          birth: "2001-03-29",
        }),
      });

      if (!backendResponse.ok) {
        // 백엔드 응답 오류를 클라이언트에 전달
        return res.status(backendResponse.status).json({
          message: "Error sending code to backend",
        });
      }

      // 백엔드에서 받은 데이터를 클라이언트에 전달
      const jsonReponse = await backendResponse.json();
      if (!jsonReponse.success) {
        throw new Error("api 서버에서 회원가입 실패");
      }
      const data = json.data;

      // 쿠키에 토큰 저장
      const { accessToken, refreshToken } = data;
      res.setHeader("Set-Cookie", [`accessToken=${accessToken}; Path=/; SameSite=Strict`, `refreshToken=${refreshToken}; Path=/; HttpOnly; SameSite=Strict`]);
      return res.status(200).json({ success: true, registered: true });
    } catch (error) {
      // 네트워크 오류 처리
      return res.status(500).json({ message: error.message });
    }
  } else {
    // POST가 아닌 다른 메소드에 대한 요청 처리
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}