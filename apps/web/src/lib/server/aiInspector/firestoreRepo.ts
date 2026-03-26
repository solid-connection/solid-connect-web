import "server-only";
import { FieldValue, type Firestore } from "firebase-admin/firestore";
import type { UserRole } from "@/types/mentor";

export interface HoverRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ElementSelection {
  selector: string;
  tagName: string;
  className: string;
  textSnippet: string;
  rect: HoverRect;
}

export interface CreateAiInspectorTaskInput {
  instruction: string;
  pageUrl: string;
  selection: ElementSelection;
  requestedBy: {
    role: UserRole;
    userId: string | null;
  };
}

const getCollectionName = () => process.env.AI_INSPECTOR_FIRESTORE_COLLECTION?.trim() || "aiInspectorTasks";

export const createQueuedAiInspectorTask = async (db: Firestore, input: CreateAiInspectorTaskInput) => {
  const docRef = await db.collection(getCollectionName()).add({
    status: "queued",
    instruction: input.instruction,
    pageUrl: input.pageUrl,
    selector: input.selection.selector,
    element: input.selection,
    source: "web-admin-inspector",
    requestedBy: input.requestedBy,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return { taskId: docRef.id };
};
