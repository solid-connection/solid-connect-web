import type { Metadata } from "next";

import { NO_INDEX_ROBOTS } from "@/utils/seo";

import PostModifyContent from "./PostModifyContent";

interface PostModifyPageProps {
  params: Promise<{
    boardCode: string;
    postId: string;
  }>;
}

export const metadata: Metadata = {
  title: "글 수정",
  robots: NO_INDEX_ROBOTS,
};

const PostModifyPage = async ({ params }: PostModifyPageProps) => {
  const { boardCode, postId } = await params;

  return (
    <div className="w-full px-5 md:px-0">
      <PostModifyContent boardCode={boardCode} postId={Number(postId)} />
    </div>
  );
};

export default PostModifyPage;
