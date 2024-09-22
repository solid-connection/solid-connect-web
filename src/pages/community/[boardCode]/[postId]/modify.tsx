import Head from "next/head";
import { useEffect, useState } from "react";

import { getPostDetailApi } from "@/services/community";

import PostModifyForm from "@/containers/community/post-create/post-modify-form";

import { Post } from "@/types/community";

type PostCreatePageProps = {
  boardCode: string;
  postId: number;
};

export default function PostCreatePage({ boardCode, postId }: PostCreatePageProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      await getPostDetailApi(boardCode, postId)
        .then((res) => {
          setPost(res.data);
        })
        .catch((err) => {
          if (err.response) {
            console.error("Axios response error", err.response);
            if (err.response.status === 401 || err.response.status === 403) {
              alert("로그인이 필요합니다");
              document.location.href = "/login";
            } else {
              alert(err.response.data?.message);
            }
          } else {
            console.error("Error", err.message);
            alert(err.message);
          }
        });
      setIsLoading(false);
    };
    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <Head>
        <title>글 수정</title>
      </Head>
    );
  }

  return (
    <>
      <Head>
        <title>글 수정</title>
      </Head>
      <div>
        <PostModifyForm
          boardCode={boardCode}
          postId={postId}
          defaultTitle={post.title}
          defaultContent={post.content}
          defaultIsQuestion={post.isQuestion}
          defaultPostCategory={post.postCategory}
        />
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { boardCode, postId }: { boardCode: string; postId: number } = params;
  return { props: { boardCode, postId } };
}
