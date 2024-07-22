import Head from "next/head";

import PostForm from "@/components/community/post-create/post-form";
import TopDetailNavigation from "@/components/layout/top-detail-navigation";

export default function PostCreatePage() {
  return (
    <>
      <Head>
        <title>글쓰기</title>
      </Head>
      <TopDetailNavigation title="글쓰기" />
      <div>
        <PostForm />
      </div>
    </>
  );
}
