import { useState } from "react";
import Head from "next/head";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import ProgressBar from "@/components/score/register/progress-bar";
import FormCollege from "@/components/score/register/form-college";
import FormCollegeFinal from "@/components/score/register/form-college-final";

export default function CollegeRegisterPage() {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(1);

  const [firstCollege, setFirstCollege] = useState("");
  const [secondCollege, setSecondCollege] = useState("");

  function handleBack() {
    if (currentStage === 2) {
      setCurrentStage(currentStage - 1);
      setProgress(0);
      return;
    }
    return;
  }

  function renderCurrentForm() {
    switch (currentStage) {
      case 1:
        return (
          <FormCollege
            toNextStage={() => {
              setCurrentStage(2);
              setProgress(50);
            }}
            text="1지망"
            college={firstCollege}
            setCollege={setFirstCollege}
          />
        );
      case 2:
        return (
          <FormCollege
            toNextStage={() => {
              setCurrentStage(3);
              setProgress(100);
              // 학교정보 api 전송
            }}
            text="2지망"
            college={secondCollege}
            setCollege={setSecondCollege}
          />
        );
      case 3:
        return <FormCollegeFinal />;
      default:
        return <div>Survey Completed!</div>;
    }
  }
  return (
    <>
      <Head>
        <title>지원하기</title>
      </Head>
      <TopDetailNavigation title="지원하기" handleBack={handleBack} />
      <div style={{ height: "calc(100vh - 112px)", display: "flex", flexDirection: "column" }}>
        <ProgressBar style={{ padding: "11px 20px 0 20px" }} progress={progress} description="본 과정 완료 후, 지원자 현황을 확인 할 수 있습니다." />
        {renderCurrentForm()}
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  // 요청에서 쿠키를 추출합니다.
  const { req } = context;
  const accessToken = req.cookies["accessToken"];

  // 토큰 유효성 검사 로직 (예제 코드)
  const isLogin = accessToken ? true : false;

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