export async function getMyData(accessToken) {
  try {
    const backendResponse = await fetch(`${process.env.API_SERVER_URL}/my-page`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    // 토큰 만료 시 재발급
    if (backendResponse.status === 401) {
      return null;
    }
    // 오류 처리
    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      throw new Error(errorData.message);
    }
    const data = await backendResponse.json();
    if (!data.success) {
      throw new Error(data.error);
    }

    return data.data;
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
}

export default async function handler(req, res) {
  const id = req.query.id;
  const collegeData = await getCollegeDetailData(id);
  if (req.method === "GET") {
    res.status(200).json(collegeData);
  }
}
