export async function getCollegeDetailData(collegeId) {
  try {
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/university/detail/${collegeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return backendResponse.json();
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
