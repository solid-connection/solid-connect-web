import { useState } from "react";
import Head from "next/head";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import ProgressBar from "@/components/score/register/progress-bar";
import Button from "@/components/ui/block-btn";

import FormLanguage from "@/components/score/register/form-language";
import FormScore from "@/components/score/register/form-score";
import FormFinal from "@/components/score/register/form-final";

export default function ScoreRegisterPage() {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(1);

  const currentForm = <FormLanguage />;
  function renderCurrentForm() {
    switch (currentStage) {
      case 1:
        return <FormLanguage setProgress={setProgress} />;
      case 2:
        return <FormScore setProgress={setProgress} />;
      case 3:
        return <FormFinal setProgress={setProgress} />;
      default:
        return <div>Survey Completed!</div>;
    }
  }
  return (
    <>
      <Head>
        <title>성적 입력하기</title>
      </Head>
      <TopDetailNavigation title="성적 입력하기" />
      <div>
        <ProgressBar style={{ margin: "11px 20px 0 20px" }} progress={progress} />
        {renderCurrentForm()}
      </div>
    </>
  );
}
