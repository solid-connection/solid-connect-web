import { useState, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import createApiClient from "@/lib/clientApiClient";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import ProgressBar from "@/components/score/register/progress-bar";

import FormLanguage from "@/components/score/register/form-language";
import FormScore from "@/components/score/register/form-score";
import FormFinal from "@/components/score/register/form-final";

export default function ScoreRegisterPage() {
  const router = useRouter();
  const apiClient = createApiClient();

  const [progress, setProgress] = useState<number>(0);
  const [currentStage, setCurrentStage] = useState<number>(1);

  const [languageType, setLanguageType] = useState<string>("");
  const [languageScore, setLanguageScore] = useState("");
  const [languageCert, setLanguageCert] = useState("");
  const [scoreType, setScoreType] = useState("4.5");
  const [score, setScore] = useState("");
  const [scoreCert, setScoreCert] = useState("");

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

  function submitForm() {
    async function postData() {
      const languageCertRes = await apiClient.post(
        "/file/language-test",
        {
          file: languageCert,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const languageFileUrl = languageCertRes.data.data.imageUrl;

      const scoreCertRes = await apiClient.post(
        "/file/gpa",
        {
          file: scoreCert,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const scoreFileUrl = scoreCertRes.data.data.imageUrl;
      const languageTypeConvert = {
        toeic: "TOEIC",
        ibt: "TOEFL_IBT",
        itp: "TOEFL_ITP",
        ielts: "IELTS",
        jlpt: "JLPT",
        others: "DUOLINGO",
      };
      await apiClient.post("/application/score", {
        languageTestType: languageTypeConvert[languageType],
        languageTestScore: languageScore,
        languageTestReportUrl: languageFileUrl,
        gpaCriteria: parseFloat(scoreType),
        gpa: parseFloat(score),
        gpaReportUrl: scoreFileUrl,
      });
      router.push("/score/college-register");
    }
    // 서버로 데이터 전송
    try {
      postData();
    } catch (error) {
      console.error(error);
    }
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
        <ProgressBar style={{ margin: "11px 20px 0 20px" }} progress={progress} />
        {renderCurrentForm()}
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  // 요청에서 쿠키를 추출합니다.
  const { req } = context;
  const { refreshToken } = req.cookies;

  // 토큰 유효성 검사 로직 (예제 코드)
  const isLogin = !!refreshToken;

  if (!isLogin) {
    // 비로그인 상태일 경우 로그인 페이지로 리다이렉트
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}