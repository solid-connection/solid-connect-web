import fs from "fs";
import path from "path";

export async function getPostDetail(postId) {
  // const filePath = path.join(process.cwd(), "datas/colleges.json");
  // const fileData = fs.readFileSync(filePath);
  // const collegeData = JSON.parse(fileData);

  // return collegeData.find((college) => college.id.toString() === collegeId.toString());
  return {
    id: 1,
    title: "보라스 대학교에 관한 정보",
    createdAt: "2024. 1. 1. 13:00",
    category: "동행",
    content: "안녕하세요 유저가 작성한 글의 내용 일부가 여기에 보입니다. 몇글자가 들어가는지는 모르겠지만 더 들어간다면",
    images: [],
    favoriteCount: 6,
    author: {
      id: 1,
      name: "김사과",
      profileImage: null,
    },
    comments: [
      {
        id: 1,
        author: {
          id: 2,
          name: "김솔커",
          profileImage: null,
        },
        content: "파견교를 선택할때 가장 중요하게 생각한 요소가 있나요?",
        createdAt: "2024. 1. 1. 13:00",
      },
      {
        id: 2,
        author: {
          id: 2,
          name: "김바나나",
          profileImage: null,
        },
        content: "파견교를 선택할때 가장 중요하게 생각한 요소가 있나요?",
        createdAt: "2024. 1. 1. 13:00",
      },
    ],
  };
}

export default async function handler(req, res) {
  const id = req.query.id;
  const postData = await getPostDetail(id);
  if (req.method === "GET") {
    res.status(200).json({ post: postData });
  }
}
