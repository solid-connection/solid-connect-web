import type { Metadata } from "next";

import { NO_INDEX_ROBOTS } from "@/utils/seo";
import PostPageContent from "./PostPageContent";

interface PostPageProps {
  params: Promise<{
    boardCode: string;
    postId: string;
  }>;
}

export const metadata: Metadata = {
  title: "게시글 | 솔리드커넥션",
  robots: NO_INDEX_ROBOTS,
};

const PostPage = async ({ params }: PostPageProps) => {
  const { boardCode, postId: postIdParam } = await params;
  const postId = Number(postIdParam);

  return (
    <div className="w-full">
      <PostPageContent boardCode={boardCode} postId={postId} />
    </div>
  );
};

export default PostPage;
