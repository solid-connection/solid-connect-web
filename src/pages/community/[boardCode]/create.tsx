import Head from "next/head";

import PostForm from "@/containers/community/post-create/post-form";

export default function PostCreatePage({ boardCode }: { boardCode: string }) {
  return (
    <>
      <Head>
        <title>글쓰기</title>
      </Head>
      <div>
        <PostForm boardCode={boardCode} />
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { boardCode }: { boardCode: string } = params;
  return { props: { boardCode } };
}
