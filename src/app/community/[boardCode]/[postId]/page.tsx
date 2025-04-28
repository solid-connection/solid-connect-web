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
    <>
      <PostPageContent boardCode={boardCode} postId={postId} />
    </>
  );
};

export default PostPage;
