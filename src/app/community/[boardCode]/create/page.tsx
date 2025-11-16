import PostForm from "./PostForm";

export const metadata = {
  title: "글쓰기",
};

const PostCreatePage = ({ params }: { params: { boardCode: string } }) => {
  const { boardCode } = params;
  return (
    <div className="w-full">
      <PostForm boardCode={boardCode} />
    </div>
  );
};

export default PostCreatePage;
