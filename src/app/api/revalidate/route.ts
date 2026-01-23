import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

/**
 * @description Revalidation 요청 body 타입
 */
interface RevalidateRequestBody {
  path?: string;
  tag?: string;
  boardCode?: string;
}

/**
 * @description ISR 페이지를 수동으로 revalidate하는 API
 * POST /api/revalidate
 * Headers: Authorization: Bearer <accessToken>
 * Body: { path?: string, tag?: string, boardCode?: string }
 *
 * @security 사용자 인증(accessToken)으로 보호됨
 */
async function POST(request: NextRequest) {
  try {
    // 1. 사용자 인증 확인 (Authorization 헤더의 accessToken)
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ revalidated: false, message: "Unauthorized" }, { status: 401 });
    }

    const accessToken = authHeader.substring(7);

    if (!accessToken) {
      return NextResponse.json({ revalidated: false, message: "Unauthorized" }, { status: 401 });
    }

    // 2. 백엔드 API로 토큰 검증 (/my 엔드포인트 사용)
    // 실제 사용자인지 확인하여 악의적인 revalidation 방지
    try {
      const apiServerUrl = process.env.NEXT_PUBLIC_API_SERVER_URL || "";
      const verifyResponse = await fetch(`${apiServerUrl}/my`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!verifyResponse.ok) {
        return NextResponse.json({ revalidated: false, message: "Forbidden" }, { status: 403 });
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      return NextResponse.json({ revalidated: false, message: "Forbidden" }, { status: 403 });
    }

    // 3. 인증 성공 - Revalidation 로직 수행
    const body = (await request.json()) as RevalidateRequestBody;
    const { path, tag, boardCode } = body;

    // boardCode가 있으면 해당 커뮤니티 페이지 revalidate
    if (boardCode) {
      revalidatePath(`/community/${boardCode}`);
      revalidateTag(`posts-${boardCode}`);

      return NextResponse.json({
        revalidated: true,
        message: `Community page for ${boardCode} revalidated`,
        timestamp: Date.now(),
      });
    }

    // 특정 경로 revalidate
    if (path) {
      revalidatePath(path);
      return NextResponse.json({
        revalidated: true,
        message: `Path ${path} revalidated`,
        timestamp: Date.now(),
      });
    }

    // 특정 태그 revalidate
    if (tag) {
      revalidateTag(tag);
      return NextResponse.json({
        revalidated: true,
        message: `Tag ${tag} revalidated`,
        timestamp: Date.now(),
      });
    }

    return NextResponse.json({ revalidated: false, message: "Missing path, tag, or boardCode" }, { status: 400 });
  } catch (error) {
    console.error("Revalidate error:", error);
    return NextResponse.json({ revalidated: false, message: "Error revalidating" }, { status: 500 });
  }
}

export { POST };
