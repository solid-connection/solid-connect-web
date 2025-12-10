import { Metadata } from "next";

import PostPageContent from "./PostPageContent";

interface PostPageProps {
  params: {
    boardCode: string;
    postId: string;
  };
}

export const metadata: Metadata = {
  title: "게시글",
};

const PostPage = ({ params }: PostPageProps) => {
  const { boardCode } = params;
  const postId = Number(params.postId);

  return (
    <div className="w-full">
      <PostPageContent boardCode={boardCode} postId={postId} />
    </div>
  );
};

export default PostPage;
