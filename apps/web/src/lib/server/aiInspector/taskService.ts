import "server-only";
import { type CreateAiInspectorTaskInput, createQueuedAiInspectorTask } from "@/lib/server/aiInspector/firestoreRepo";
import { getFirebaseAdminFirestore } from "@/lib/server/firebaseAdmin";

export const queueAiInspectorTask = async (input: CreateAiInspectorTaskInput) => {
  const db = getFirebaseAdminFirestore();
  if (!db) {
    throw new Error("AI inspector Firebase Admin is not configured.");
  }

  return createQueuedAiInspectorTask(db, input);
};
