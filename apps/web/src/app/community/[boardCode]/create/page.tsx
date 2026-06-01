import { NO_INDEX_ROBOTS } from "@/utils/seo";
import PostForm from "./PostForm";

export const metadata = {
  title: "글쓰기",
  robots: NO_INDEX_ROBOTS,
};

const PostCreatePage = async ({ params }: { params: Promise<{ boardCode: string }> }) => {
  const { boardCode } = await params;
  return (
    <div className="w-full">
      <PostForm boardCode={boardCode} />
    </div>
  );
};

export default PostCreatePage;
