import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * @description ISR 페이지를 수동으로 revalidate하는 API
 * POST /api/revalidate
 * Body: { path?: string, tag?: string, boardCode?: string }
 */
export async function POST(request: NextRequest) {
  try {
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

