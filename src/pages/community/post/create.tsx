import Head from "next/head";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import PostForm from "@/components/community/post-create/post-form";

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
