import admin from "firebase-admin";
import { initializeApp } from "firebase-admin/app";

// const app = initializeApp();

let firestore = null;

async function initializeFirebaseAdmin() {
  if (!admin.apps.length) {
    const serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
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
      firestore = admin.firestore();
    } catch (error) {
      console.error("Firebase admin initialization error", error);
      throw error;
    }
  }
  return firestore || admin.firestore();
}

export default initializeFirebaseAdmin;
