import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

/**
 * @description ISR 페이지를 수동으로 revalidate하는 API
 * POST /api/revalidate
 * Headers: Authorization: Bearer <REVALIDATE_SECRET> or X-Revalidate-Secret: <REVALIDATE_SECRET>
 * Body: { path?: string, tag?: string, boardCode?: string }
 *
 * @security 환경변수 REVALIDATE_SECRET으로 보호됨
 */
export async function POST(request: NextRequest) {
  try {
    // 1. 인증 확인
    const expectedSecret = process.env.REVALIDATE_SECRET;

    if (!expectedSecret) {
      console.error("REVALIDATE_SECRET is not configured");
      return NextResponse.json({ revalidated: false, message: "Server configuration error" }, { status: 500 });
    }

    // 2. 요청에서 secret 추출 (Authorization 헤더 또는 X-Revalidate-Secret 헤더)
    const authHeader = request.headers.get("authorization");
    const customHeader = request.headers.get("x-revalidate-secret");

    let providedSecret: string | null = null;

    if (authHeader?.startsWith("Bearer ")) {
      providedSecret = authHeader.substring(7);
    } else if (customHeader) {
      providedSecret = customHeader;
    }

    // 3. Secret 검증
    if (!providedSecret) {
      return NextResponse.json({ revalidated: false, message: "Unauthorized" }, { status: 401 });
    }

    // 4. Timing-safe 비교로 secret 검증
    try {
      const expectedBuffer = Buffer.from(expectedSecret, "utf-8");
      const providedBuffer = Buffer.from(providedSecret, "utf-8");

      // 길이가 다르면 false
      if (expectedBuffer.length !== providedBuffer.length) {
        return NextResponse.json({ revalidated: false, message: "Forbidden" }, { status: 403 });
      }

      // Timing-safe 비교
      if (!timingSafeEqual(expectedBuffer, providedBuffer)) {
        return NextResponse.json({ revalidated: false, message: "Forbidden" }, { status: 403 });
      }
    } catch {
      // timingSafeEqual 실행 중 오류 (예: 길이 불일치)
      return NextResponse.json({ revalidated: false, message: "Forbidden" }, { status: 403 });
    }

    // 5. 인증 성공 - Revalidation 로직 수행
    const body = await request.json();
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

    return NextResponse.json(
      { revalidated: false, message: "Missing path, tag, or boardCode" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Revalidate error:", error);
    return NextResponse.json(
      { revalidated: false, message: "Error revalidating" },
      { status: 500 }
    );
  }
}

