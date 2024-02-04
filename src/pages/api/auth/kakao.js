export default async function handler(req, res) {
  if (req.method === "POST") {
    const { code } = req.body;

    try {
      const backendResponse = await fetch(`${process.env.API_SERVER_URL}/auth/kakao`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: code }),
      });

      if (!backendResponse.ok) {
        // console.log(backendResponse.status, backendResponse.statusText);
        // console.log(backendResponse);
        // 백엔드 응답 오류를 클라이언트에 전달
        return res.status(backendResponse.status).json({
          message: "Error sending code to backend",
        });
      }

      // 백엔드에서 받은 데이터를 클라이언트에 전달
      const data = await backendResponse.json();
      return res.status(200).json(data);
    } catch (error) {
      // 네트워크 오류 처리
      return res.status(500).json({ message: error.message });
    }
  } else {
    // POST가 아닌 다른 메소드에 대한 요청 처리
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
