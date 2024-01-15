import fs from "fs";
import path from "path";

export async function getCollegeDetailData(collegeId) {
  const filePath = path.join(process.cwd(), "datas/colleges.json");
  const fileData = fs.readFileSync(filePath);
  const collegeData = JSON.parse(fileData);

  return collegeData.find((college) => college.id.toString() === collegeId.toString());
}

export default async function handler(req, res) {
  const id = req.query.id;
  const collegeData = await getCollegeDetailData(id);
  if (req.method === "GET") {
    res.status(200).json({ college: collegeData });
  }
}
