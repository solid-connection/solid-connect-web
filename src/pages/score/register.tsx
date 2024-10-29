import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

import { postApplicationScoreApi } from "@/services/application";
import { uploadGpaFileApi, uploadLanguageTestFileApi } from "@/services/file";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import CertFinalScreen from "@/components/score/register/cert-final-screen";
import FormFinal from "@/components/score/register/form-final";
import FormLanguage from "@/components/score/register/form-language";
import FormScore from "@/components/score/register/form-score";
import ProgressBar from "@/components/score/register/progress-bar";

import { LANGUAGE_TEST_CONVERSE } from "@/constants/application";

export default function ScoreRegisterPage() {
  const router = useRouter();
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
    return null;
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
    return null;
  };

  function handleBack() {
    if (currentStage === 1) {
      router.back();
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
      try {
        // 어학성적 증명 파일 업로드
        const languageCertRes = await uploadLanguageTestFileApi(languageCert);

        const languageFileUrl = languageCertRes.data.fileUrl;

        // 학점 증명 파일 업로드
        const scoreCertRes = await uploadGpaFileApi(scoreCert);

        const scoreFileUrl = scoreCertRes.data.fileUrl;

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
        document.location.href = "/login"; // 로그인 페이지로 이동
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
          <FormFinal
            toNextStage={() => {
              submitForm();
            }}
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
        return <CertFinalScreen />;
      default:
        return <div>Survey Completed!</div>;
    }
  }
  return (
    <>
      <Head>
        <title>성적 입력하기</title>
      </Head>
      <TopDetailNavigation
        title="성적 입력하기"
        handleBack={() => {
          handleBack();
        }}
      />
      <div style={{ height: "calc(100vh - 112px)", display: "flex", flexDirection: "column" }}>
        <ProgressBar style={{ margin: "11px 20px 0 20px" }} progress={getProgress()} display={getProgressDisplay()} />
        {renderCurrentForm()}
      </div>
    </>
  );
}
