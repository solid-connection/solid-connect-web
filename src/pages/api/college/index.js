import path from "path";
import fs from "fs";

export async function getCollegeListData() {
  const filePath = path.join(process.cwd(), "datas/colleges.json");
  const fileData = fs.readFileSync(filePath);
  const collegeData = JSON.parse(fileData);

  return collegeData;
}

export default async function handler(req, res) {
  const collegeData = await getCollegeListData();
  if (req.method === "GET") {
    res.status(200).json({ colleges: collegeData });
  }
}
