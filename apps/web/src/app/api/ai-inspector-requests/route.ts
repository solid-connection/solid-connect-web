import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { queueAiInspectorTask } from "@/lib/server/aiInspector/taskService";
import { UserRole } from "@/types/mentor";

const selectionSchema = z.object({
  selector: z.string().trim().min(1).max(500),
  tagName: z.string().trim().min(1).max(80),
  className: z.string().max(1000),
  textSnippet: z.string().max(280),
  rect: z.object({
    x: z.number().finite(),
    y: z.number().finite(),
    width: z.number().finite(),
    height: z.number().finite(),
  }),
});

const requestBodySchema = z.object({
  instruction: z.string().trim().min(1).max(1000),
  pageUrl: z.string().trim().url().max(2000),
  selection: selectionSchema,
});

const decodeTokenUserId = (accessToken: string): string | null => {
  try {
    const payloadSegment = accessToken.split(".")[1];
    if (!payloadSegment) {
      return null;
    }

    const normalized = payloadSegment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const payload = JSON.parse(Buffer.from(padded, "base64").toString("utf8")) as { sub?: string | number };

    if (!payload.sub) {
      return null;
    }

    return String(payload.sub);
  } catch {
    return null;
  }
};

const verifyAdminRole = async (accessToken: string): Promise<boolean> => {
  const apiServerUrl = process.env.NEXT_PUBLIC_API_SERVER_URL?.trim();
  if (!apiServerUrl) {
    throw new Error("NEXT_PUBLIC_API_SERVER_URL is not configured.");
  }

  try {
    const response = await fetch(`${apiServerUrl}/my`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return false;
    }

    const data = (await response.json()) as { role?: string };
    return data.role === UserRole.ADMIN;
  } catch {
    return false;
  }
};

const getAccessToken = (request: NextRequest): string | null => {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7).trim();
  return token || null;
};

async function POST(request: NextRequest) {
  const accessToken = getAccessToken(request);
  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: z.infer<typeof requestBodySchema>;
  try {
    const parsedBody = await request.json();
    body = requestBodySchema.parse(parsedBody);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "요청 값이 올바르지 않습니다." }, { status: 400 });
    }

    return NextResponse.json({ message: "요청 본문을 읽을 수 없습니다." }, { status: 400 });
  }

  let isAdmin = false;
  try {
    isAdmin = await verifyAdminRole(accessToken);
  } catch {
    return NextResponse.json({ message: "서버 인증 설정 오류입니다." }, { status: 500 });
  }

  if (!isAdmin) {
    return NextResponse.json({ message: "관리자 권한이 필요합니다." }, { status: 403 });
  }

  try {
    const result = await queueAiInspectorTask({
      instruction: body.instruction,
      pageUrl: body.pageUrl,
      selection: body.selection,
      requestedBy: {
        role: UserRole.ADMIN,
        userId: decodeTokenUserId(accessToken),
      },
    });

    return NextResponse.json({ taskId: result.taskId, status: "queued" }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "요청 저장에 실패했습니다." }, { status: 503 });
  }
}

export { POST };
