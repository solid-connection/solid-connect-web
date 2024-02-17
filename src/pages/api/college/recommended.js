export async function getRecommendedCollegesData() {
  try {
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/home`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // 오류 처리
    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      throw new Error(errorData.message);
    }
    const data = await backendResponse.json();
    if (!data.success) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
}

export default async function handler(req, res) {
  const { id } = req.query;
  const collegesData = await getRecommendedCollegesData(id);
  if (req.method === "GET") {
    res.status(200).json(collegesData);
  }
}
