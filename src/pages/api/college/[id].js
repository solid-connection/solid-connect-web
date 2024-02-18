export async function getCollegeDetailData(collegeId) {
  try {
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/university/detail/${collegeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      throw new Error(errorData.error.code + ": " + errorData.error.message);
    }

    return data;
  } catch (error) {
    console.error(error);
    return { success: false, error: error };
  }
}

export default async function handler(req, res) {
  const { id } = req.query;
  const collegeData = await getCollegeDetailData(id);
  if (req.method === "GET") {
    res.status(200).json(collegeData);
  }
}
