// *** NOT USED ANYMORE ***

export async function getCollegeListData() {
  try {
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/university/search`, {
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

  // 파일에서 불러오기
  // const filePath = path.join(process.cwd(), "datas/24-2colleges.json");
  // const fileData = fs.readFileSync(filePath);
  // const collegeData = JSON.parse(fileData);

  // return { data: collegeData };
}

export default async function handler(req, res) {
  const collegeData = await getCollegeListData();
  if (req.method === "GET") {
    res.status(200).json({ colleges: collegeData });
  }
}
