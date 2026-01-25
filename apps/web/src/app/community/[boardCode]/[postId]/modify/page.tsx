import type { Metadata } from "next";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

import PostModifyContent from "./PostModifyContent";

interface PostModifyPageProps {
  params: {
    boardCode: string;
    postId: string;
  };
}

export const metadata: Metadata = {
  title: "글 수정",
};

const PostModifyPage = ({ params }: PostModifyPageProps) => {
  const { boardCode, postId } = params;

  return (
    <>
      <TopDetailNavigation title="글 수정" />
      <div className="w-full px-5">
        <PostModifyContent boardCode={boardCode} postId={Number(postId)} />
      </div>
    </>
  );
};

export default PostModifyPage;
