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

type AdminVerificationStatus = "authorized" | "unauthorized" | "forbidden" | "error";

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

const parseRoleValue = (rawValue: unknown): string => {
  if (typeof rawValue !== "string") {
    return "";
  }

  return rawValue.trim().toUpperCase();
};

const hasAdminRole = (rawValue: unknown): boolean => {
  const normalizedRole = parseRoleValue(rawValue);
  return normalizedRole === UserRole.ADMIN || normalizedRole === "ROLE_ADMIN";
};

const getRoleFromMyResponse = (data: unknown): unknown => {
  if (!data || typeof data !== "object") {
    return "";
  }

  const root = data as Record<string, unknown>;
  if (typeof root.role === "string") {
    return root.role;
  }

  const nestedData = root.data;
  if (nestedData && typeof nestedData === "object") {
    const nested = nestedData as Record<string, unknown>;
    if (typeof nested.role === "string") {
      return nested.role;
    }
  }

  return "";
};

const decodeTokenRole = (accessToken: string): unknown => {
  try {
    const payloadSegment = accessToken.split(".")[1];
    if (!payloadSegment) {
      return "";
    }

    const normalized = payloadSegment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const payload = JSON.parse(Buffer.from(padded, "base64").toString("utf8")) as { role?: string };
    return payload.role ?? "";
  } catch {
    return "";
  }
};

const verifyAdminRole = async (accessToken: string): Promise<AdminVerificationStatus> => {
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

    if (response.status === 401) {
      return "unauthorized";
    }

    if (!response.ok) {
      return "forbidden";
    }

    const data = (await response.json().catch(() => null)) as unknown;
    const responseRole = getRoleFromMyResponse(data);
    if (hasAdminRole(responseRole)) {
      return "authorized";
    }

    // Fallback: /my 인증(200)은 통과했는데 응답 role 스키마가 다른 경우를 대비.
    if (hasAdminRole(decodeTokenRole(accessToken))) {
      return "authorized";
    }

    return "forbidden";
  } catch {
    return "error";
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

  let verificationStatus: AdminVerificationStatus = "forbidden";
  try {
    verificationStatus = await verifyAdminRole(accessToken);
  } catch {
    return NextResponse.json({ message: "서버 인증 설정 오류입니다." }, { status: 500 });
  }

  if (verificationStatus === "unauthorized") {
    return NextResponse.json({ message: "로그인 세션이 만료되었습니다. 다시 로그인해주세요." }, { status: 401 });
  }

  if (verificationStatus === "error") {
    return NextResponse.json(
      { message: "관리자 권한 확인에 실패했습니다. 잠시 후 다시 시도해주세요." },
      { status: 503 },
    );
  }

  if (verificationStatus !== "authorized") {
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
