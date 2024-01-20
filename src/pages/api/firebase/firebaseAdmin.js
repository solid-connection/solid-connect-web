import admin from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccount = require("../../../../solid-connect-c7a88-firebase-adminsdk-8f2ji-df497d406c.json"); // 서비스 계정 키 파일 경로를 수정하세요.

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin.firestore();
