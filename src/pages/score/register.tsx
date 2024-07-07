import { useState, useEffect } from "react";
import Head from "next/head";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import ProgressBar from "@/components/score/register/progress-bar";

import FormLanguage from "@/components/score/register/form-language";
import FormScore from "@/components/score/register/form-score";
import FormFinal from "@/components/score/register/form-final";
import FormCollegeFinal from "@/components/score/register/form-college-final";
import { postApplicationScoreApi, usePostApplicationScore } from "@/services/application";
import { uploadGpaFileApi, uploadLanguageTestFileApi, useUploadGpaFile, useUploadLanguageTestFile } from "@/services/file";
import { LANGUAGE_TEST_CONVERSE } from "@/types/application";

export default function ScoreRegisterPage() {
  const [currentStage, setCurrentStage] = useState<number>(1);

  const [languageType, setLanguageType] = useState<string>("");
  const [languageScore, setLanguageScore] = useState("");
  const [languageCert, setLanguageCert] = useState<File>(null);
  const [scoreType, setScoreType] = useState("4.5");
  const [score, setScore] = useState("");
  const [scoreCert, setScoreCert] = useState<File>(null);

  const getProgress = () => {
    if (currentStage === 1) {
      return 0;
    }
    if (currentStage === 2) {
      return 50;
    }
    if (currentStage === 3) {
      return 95;
    }
    if (currentStage === 4) {
      return 100;
    }
  };

  const getProgressDisplay = () => {
    if (currentStage === 1) {
      return "0/2";
    }
    if (currentStage === 2) {
      return "1/2";
    }
    if (currentStage === 3) {
      return "2/2";
    }
  };

  function handleBack() {
    if (currentStage === 1) {
      return;
    }
    if (currentStage === 2) {
      setCurrentStage(currentStage - 1);
    }
    if (currentStage === 3) {
      setCurrentStage(currentStage - 1);
    }
  }

  function submitForm() {
    async function postData() {
      // 어학성적 증명 파일 업로드
      const [languageData, languageError, languageLoading] = await useUploadLanguageTestFile(languageCert);
      const languageFileUrl = languageData.data.fileUrl;

      // 학점 증명 파일 업로드
      const [scoreData, scoreError, scoreLoading] = await useUploadGpaFile(scoreCert);
      const scoreFileUrl = scoreData.data.fileUrl;

      if (!scoreLoading && !languageLoading) {
        if (languageError) {
          if (languageError.response) {
            console.error("Axios response error", languageError.response.data);
            alert(languageError.response.data?.error?.message);
          } else if (languageError.reqeust) {
            console.error("Axios request error", languageError.request);
          } else {
            console.error("Error", languageError.message);
            alert(languageError.message);
          }
        }
        if (scoreError) {
          if (scoreError.response) {
            console.error("Axios response error", scoreError.response.data);
            alert(scoreError.response.data?.error?.message);
          } else if (scoreError.reqeust) {
            console.error("Axios request error", scoreError.request);
          } else {
            console.error("Error", scoreError.message);
            alert(scoreError.message);
          }
        }

        const applicationScore = {
          languageTestType: LANGUAGE_TEST_CONVERSE[languageType],
          languageTestScore: languageScore,
          languageTestReportUrl: languageFileUrl,
          gpaCriteria: parseFloat(scoreType),
          gpa: parseFloat(score),
          gpaReportUrl: scoreFileUrl,
        };

        const [data, error, loading] = await usePostApplicationScore(applicationScore);

        if (error) {
          if (error.response) {
            console.error("Axios response error", error.response.data);
            alert(error.response.data?.error?.message);
          } else if (error.reqeust) {
            console.error("Axios request error", error.request);
          } else {
            console.error("Error", error.message);
            alert(error.message);
          }
        }

        setCurrentStage(4);
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
            toNextStage={() => {
              setCurrentStage(2);
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
            toNextStage={() => {
              setCurrentStage(3);
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
          <FormFinal toNextStage={submitForm} languageType={languageType} languageScore={languageScore} languageCert={languageCert} scoreType={scoreType} score={score} scoreCert={scoreCert} setLanguageCert={setLanguageCert} setScoreCert={setScoreCert} />
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
        <ProgressBar style={{ margin: "11px 20px 0 20px" }} progress={getProgress()} display={getProgressDisplay()} />
        {renderCurrentForm()}
      </div>
    </>
  );
}
