import type { Metadata } from "next";

import PostPageContent from "./PostPageContent";

interface PostPageProps {
  params: Promise<{
    boardCode: string;
    postId: string;
  }>;
}

export const metadata: Metadata = {
  title: "게시글",
};

const PostPage = async (props: PostPageProps) => {
  const params = await props.params;
  const { boardCode } = params;
  const postId = Number(params.postId);

  return (
    <div className="w-full">
      <PostPageContent boardCode={boardCode} postId={postId} />
    </div>
  );
};

export default PostPage;
