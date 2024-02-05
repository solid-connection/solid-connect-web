export async function getUserData(accessToken) {
  return {
    nickname: "김솔커",
    profileImageUrl: "/images/catolic.png",
    role: "MENTO",
    birth: "2000.09.09",
    likedPostCount: 10,
    likedMentoCount: 5,
    likedUnivCount: 3,
    // college: "inha university",
    // email: "1234@inha.edu",
  };

  try {
    const response = await fetch(`${process.env.API_SERVER_URL}/my-page`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`, // 토큰을 Authorization 헤더에 포함
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
      return null;
    }

    const json = await response.json();
    if (json.success === false) {
      throw new Error("Failed to fetch user data");
    }

    const userData = json.data;
    return userData;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw error;
  }
}

export default async function handler(req, res) {
  // 요청에서 쿠키 추출
  const accessToken = req.cookies["accessToken"]; // 쿠키에서 accessToken 추출

  try {
    const userData = await getUserData(accessToken);
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user data" });
  }
}
