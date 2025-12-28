import admin from "firebase-admin";

// Firebase 필수 환경변수 검증
const validateFirebaseEnv = () => {
  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();

  if (!projectId) {
    throw new Error("FIREBASE_PROJECT_ID is required but not provided or empty");
  }
  if (!privateKey) {
    throw new Error("FIREBASE_PRIVATE_KEY is required but not provided or empty");
  }
  if (!clientEmail) {
    throw new Error("FIREBASE_CLIENT_EMAIL is required but not provided or empty");
  }

  return { projectId, privateKey: privateKey.replace(/\\n/g, "\n"), clientEmail };
};

// Firebase 환경변수 존재 여부 확인 (CI 빌드용)
const isFirebaseConfigured = () => {
  return !!(
    process.env.FIREBASE_PROJECT_ID?.trim() &&
    process.env.FIREBASE_PRIVATE_KEY?.trim() &&
    process.env.FIREBASE_CLIENT_EMAIL?.trim()
  );
};

const initializeFirebaseAdmin = (): admin.firestore.Firestore | null => {
  // CI 빌드 환경에서 Firebase 환경변수가 없으면 null 반환
  if (!isFirebaseConfigured()) {
    console.warn("Firebase environment variables are not configured. Skipping Firebase initialization.");
    return null;
  }

  if (!admin.apps.length) {
    // 환경변수 검증 - 불완전한 설정 시 명확한 에러 발생
    const { projectId, privateKey, clientEmail } = validateFirebaseEnv();

    const serviceAccount = {
      type: "service_account",
      projectId,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      privateKey,
      clientEmail,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
      universe_domain: "googleapis.com",
    };

    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error) {
      console.error("Firebase admin initialization error", error);
      return null;
    }
  }
  return admin.firestore();
};

export default initializeFirebaseAdmin;
