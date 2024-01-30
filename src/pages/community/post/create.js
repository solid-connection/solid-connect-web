import Head from "next/head";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import PostWriteForm from "@/components/community/post-write/post-write-form";

export default function PostCreatePage() {
  return (
    <>
      <Head>
        <title>글쓰기</title>
      </Head>
      <TopDetailNavigation title="글쓰기" />
      <div>
        <PostWriteForm />
      </div>
    </>
  );
}
