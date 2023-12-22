// Next.js Edge API Routes: https://nextjs.org/docs/pages/building-your-application/routing/api-routes#edge-api-routes

export default function handler(req, res) {
  const collegeId = req.query.id;
  if (req.method === "GET") {
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

    res.status(200).json({ college: collegeData });
  }
}
