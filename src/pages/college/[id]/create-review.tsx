import Head from "next/head";

import CollegeReviewForm from "@/components/college/college-review-form";
import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

export default function CollegeCreateReviewPage() {
  return (
    <>
      <Head>
        <title>후기 작성하기</title>
      </Head>
      <TopDetailNavigation title="후기 작성하기" />
      <CollegeReviewForm />
    </>
  );
}
