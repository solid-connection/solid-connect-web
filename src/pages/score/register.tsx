import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import ProgressBar from "@/components/score/register/progress-bar";

import FormLanguage from "@/components/score/register/form-language";
import FormScore from "@/components/score/register/form-score";
import FormFinal from "@/components/score/register/form-final";
import FormCollegeFinal from "@/components/score/register/form-college-final";
import { postApplicationScoreApi } from "@/services/application";
import { uploadGpaFileApi, uploadLanguageTestFileApi } from "@/services/file";
import { LANGUAGE_TEST_CONVERSE } from "@/types/application";

export default function ScoreRegisterPage() {
  const [progress, setProgress] = useState<number>(0);
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [progressDisplay, setProgressDisplay] = useState<string>("0/2");

  const [languageType, setLanguageType] = useState<string>("");
  const [languageScore, setLanguageScore] = useState("");
  const [languageCert, setLanguageCert] = useState<File>(null);
  const [scoreType, setScoreType] = useState("4.5");
  const [score, setScore] = useState("");
  const [scoreCert, setScoreCert] = useState<File>(null);

  function handleBack() {
    if (currentStage === 1) {
      return;
    }
    if (currentStage === 2) {
      setCurrentStage(currentStage - 1);
      setProgress(0);
    }
    if (currentStage === 3) {
      setCurrentStage(currentStage - 1);
      setProgress(50);
    }
  }
  useEffect(() => {
    if (currentStage === 1) {
      setProgressDisplay("0/2");
    } else {
      setProgressDisplay("1/2");
    }
  }, [currentStage]);

  function submitForm() {
    async function postData() {
      try {
        // 어학성적 증명 파일 업로드
        const languageCertRes = await uploadLanguageTestFileApi(languageCert);
        if (languageCertRes.data.success === false) {
          throw new Error(languageCertRes.data.error.message);
        }
        const languageFileUrl = languageCertRes.data.data.fileUrl;

        // 학점 증명 파일 업로드
        const scoreCertRes = await uploadGpaFileApi(scoreCert);
        if (scoreCertRes.data.success === false) {
          throw new Error(scoreCertRes.data.error.message);
        }
        const scoreFileUrl = scoreCertRes.data.data.fileUrl;

        const applicationScore = {
          languageTestType: LANGUAGE_TEST_CONVERSE[languageType],
          languageTestScore: languageScore,
          languageTestReportUrl: languageFileUrl,
          gpaCriteria: parseFloat(scoreType),
          gpa: parseFloat(score),
          gpaReportUrl: scoreFileUrl,
        };

        await postApplicationScoreApi(applicationScore);

        setCurrentStage(4);
        setProgress(100);
      } catch (error) {
        if (error.response) {
          console.error(error.response.data);
          alert(error.response.data);
        } else if (error.reqeust) {
          console.error(error.request);
        } else {
          console.error(error.message);
          alert(error.message);
        }
      }
    }
    // 서버로 데이터 전송
    postData();
  }

  function renderCurrentForm() {
    switch (currentStage) {
      case 1:
        return (
          <FormLanguage
            setProgress={setProgress}
            toNextStage={() => {
              setCurrentStage(2);
              setProgress(50);
            }}
            setLanguageType={setLanguageType}
            setLanguageScore={setLanguageScore}
            setLanguageCert={setLanguageCert}
            languageType={languageType}
            languageScore={languageScore}
            languageCert={languageCert}
          />
        );
      case 2:
        return (
          <FormScore
            setProgress={setProgress}
            toNextStage={() => {
              setCurrentStage(3);
              setProgress(95);
            }}
            setScoreType={setScoreType}
            setScore={setScore}
            setScoreCert={setScoreCert}
            scoreType={scoreType}
            score={score}
            scoreCert={scoreCert}
          />
        );
      case 3:
        return (
          <FormFinal
            setProgress={setProgress}
            toNextStage={submitForm}
            languageType={languageType}
            languageScore={languageScore}
            languageCert={languageCert}
            scoreType={scoreType}
            score={score}
            scoreCert={scoreCert}
            setLanguageCert={setLanguageCert}
            setScoreCert={setScoreCert}
          />
        );
      case 4:
        return <FormCollegeFinal />;
      default:
        return <div>Survey Completed!</div>;
    }
  }
  return (
    <>
      <Head>
        <title>성적 입력하기</title>
      </Head>
      <TopDetailNavigation title="성적 입력하기" handleBack={handleBack} />
      <div style={{ height: "calc(100vh - 112px)", display: "flex", flexDirection: "column" }}>
        <ProgressBar style={{ margin: "11px 20px 0 20px" }} progress={progress} display={progressDisplay} />
        {renderCurrentForm()}
      </div>
    </>
  );
}
