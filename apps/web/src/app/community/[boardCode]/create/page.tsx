import PostForm from "./PostForm";

export const metadata = {
  title: "글쓰기",
};

const PostCreatePage = async (props: { params: Promise<{ boardCode: string }> }) => {
  const params = await props.params;
  const { boardCode } = params;
  return (
    <div className="w-full">
      <PostForm boardCode={boardCode} />
    </div>
  );
};

export default PostCreatePage;
