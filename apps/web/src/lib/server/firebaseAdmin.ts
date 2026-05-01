import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { type Firestore, getFirestore } from "firebase-admin/firestore";

interface FirebaseAdminConfig {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

const readFirebaseAdminConfig = (): FirebaseAdminConfig | null => {
  const projectId = process.env.AI_INSPECTOR_FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.AI_INSPECTOR_FIREBASE_CLIENT_EMAIL?.trim();
  const privateKey = process.env.AI_INSPECTOR_FIREBASE_PRIVATE_KEY?.trim();

  if (!projectId && !clientEmail && !privateKey) {
    return null;
  }

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("AI_INSPECTOR_FIREBASE_PROJECT_ID / CLIENT_EMAIL / PRIVATE_KEY must all be configured.");
  }

  return {
    projectId,
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, "\n"),
  };
};

let cachedFirestore: Firestore | null = null;

export const getFirebaseAdminFirestore = (): Firestore | null => {
  if (cachedFirestore) {
    return cachedFirestore;
  }

  const config = readFirebaseAdminConfig();
  if (!config) {
    return null;
  }

  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: config.projectId,
        clientEmail: config.clientEmail,
        privateKey: config.privateKey,
      }),
    });
  }

  cachedFirestore = getFirestore();
  return cachedFirestore;
};
