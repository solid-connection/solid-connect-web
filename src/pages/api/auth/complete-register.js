// NOT USED ANYMORE
export async function completeRegister(kakaoOauthToken, interestedRegions, interestedCountries, preparationStatus, nickname, profileImageUrl) {}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { kakaoOauthToken, interestedRegions, interestedCountries, preparationStatus, nickname, profileImageUrl, gender, birth } = req.body;

    const genderConvertDict = {
      남성: "MALE",
      여성: "FEMALE",
      비공개: "PREFER_NOT_TO_SAY",
    };
    const body = {
      kakaoOauthToken: kakaoOauthToken,
      interestedRegions: [regionsCovertDict[interestedRegions]],
      interestedCountries: interestedCountries,
      preparationStatus: preparationStatus,
      nickname: nickname,
      profileImageUrl: profileImageUrl,
      gender: genderConvertDict[gender],
      birth: birth,
    };
    console.log(body);
    try {
      const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      console.log(backendResponse);

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
      const data = jsonReponse.data;

      // 쿠키에 토큰 저장
      const { accessToken, refreshToken } = data;
      res.setHeader("Set-Cookie", [
        // `accessToken=${accessToken}; Domain=.solid-connect.net; Path=/; Secure; SameSite=Strict; Max-Age=3600`, // 1시간 만료
        // `refreshToken=${refreshToken}; Domain=.solid-connect.net; Path=/; Secure; SameSite=Strict; Max-Age=604800`, // 7일 만료
        `accessToken=${accessToken}; Path=/; Secure; SameSite=Strict; Max-Age=3600`, // 1시간 만료
        `refreshToken=${refreshToken}; Path=/; Secure; SameSite=Strict; Max-Age=604800`, // 7일 만료
      ]);
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
