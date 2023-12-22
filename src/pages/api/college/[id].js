export async function getCollegeDetailData() {
  // const response = await fetch(/* external API endpoint */)
  //   const jsonData = await response.json()
  //   return jsonData
  const collegeData = {
    id: "1",
    name: "매사추세츠 공과대학교",
    englishName: "Massachusetts Institute of Technology",
    country: "미국",
    region: "매사추세츠주",
    url: "www.mit.edu",
    requirements: { toeic: "800", toefl: "100", ielts: "6.5", etc: "기타 어학" },
    image: "/images/temp_1629768074308100.jpg",
  };
  return collegeData;
}

export default function handler(req, res) {
  const eventId = req.query.id;
  const collegeData = getCollegeDetailData();
  if (req.method === "GET") {
    res.status(200).json({ college: collegeData });
  }
}
