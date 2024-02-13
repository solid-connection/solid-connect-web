export async function getCollegeDetailData(collegeId) {
  try {
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/university/detail/${collegeId}`, {
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

    return data.data;
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }

  // 과거 파일에서 가져오기 코드(추후 삭제)
  // const filePath = path.join(process.cwd(), "datas/colleges.json");
  // const fileData = fs.readFileSync(filePath);
  // const collegeData = JSON.parse(fileData);

  // return collegeData.find((college) => college.id.toString() === collegeId.toString());
}

export default async function handler(req, res) {
  const id = req.query.id;
  const collegeData = await getCollegeDetailData(id);
  if (req.method === "GET") {
    res.status(200).json(collegeData);
  }
}
