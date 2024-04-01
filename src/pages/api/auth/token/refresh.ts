import { KakaoLoginResponse } from "@/types/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ error: "No refresh token" });
  }

  try {
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/reissue`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    const data = await backendResponse.json();
    if (!data.success) {
      return res.status(data.error.code).json({ error: data.error.message });
    }

    res.setHeader("Set-Cookie", [
      `accessToken=${data.data.accessToken}; Path=/; Secure; SameSite=Strict; Max-Age=3600`, // 1시간 만료
    ]);
    return res.status(200).json({ accessToken: data.data.accessToken });
  } catch (error) {
    // 네트워크 오류 처리
    return res.status(500).json({ message: error.message });
  }
}
