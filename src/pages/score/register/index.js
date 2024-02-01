import { useState } from "react";
import Head from "next/head";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import ProgressBar from "@/components/score/register/progress-bar";
import Button from "@/components/score/register/button";

import FormLanguage from "@/components/score/register/form-language";

export default function ScoreRegisterPage() {
  const [progress, setProgress] = useState(50);

  const currentForm = <FormLanguage />;
  return (
    <>
      <Head>
        <title>성적 입력하기</title>
      </Head>
      <TopDetailNavigation title="성적 입력하기" />
      <div>
        <ProgressBar style={{ margin: "11px 20px 0 20px" }} progress={progress} />
        {currentForm}
        <Button text="다음" style={{ position: "fixed", width: "calc(100% - 40px)", maxWidth: "560px", margin: "0 0 0 20px", bottom: "86px" }} />
      </div>
    </>
  );
}
