export async function logout(accessToken) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/auth/sign-out`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    if (response.status === 401) {
      // 토큰이 만료되었을 때 토큰 재발급
      return null;
    }
    if (response.status === 404) {
      throw new Error("회원 정보를 찾을 수 없습니다.");
    }

    const json = await response.json();
    if (json.success === false) {
      throw new Error("로그아웃 실패");
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw error;
  }
}

export default async function handler(req, res) {
  // 요청에서 쿠키 추출
  const token = req.cookies["accessToken"]; // 쿠키에서 accessToken 추출

  try {
    const logoutResponse = await logout(token);
    if (logoutResponse.success) {
      // 로그아웃 성공 시, accessToken, refreshToken 쿠키 삭제
      res.setHeader("Set-Cookie", ["accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure", "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httpOnly; secure"]);
      res.status(200).json({ success: true, message: "로그아웃 성공" });
    } else {
      // 로그아웃 프로세스에서 문제 발생
      res.status(500).json({ success: false, message: "로그아웃 실패" });
    }
  } catch (error) {
    res.status(500).json({ message: "로그아웃 실패: 알 수 없는 에러" });
  }
}
