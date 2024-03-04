import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import fs from "fs";
import path from "path";
import createApiClient from "@/lib/clientApiClient";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import ProgressBar from "@/components/score/register/progress-bar";
import FormCollege from "@/components/score/register/form-college";

export default function CollegeRegisterPage({ collegesKeyName }) {
  const router = useRouter();
  const apiClient = createApiClient();
  const [progress, setProgress] = useState<number>(0);
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [description, setDescription] = useState<string>("본 과정 완료 후, 지원자 현황을 확인 할 수 있습니다.");

  const [firstCollege, setFirstCollege] = useState<string>("");
  const [secondCollege, setSecondCollege] = useState<string>("");

  useEffect(() => {
    let updateCount = 0;
    async function fetchData() {
      try {
        const res = await apiClient.get("/application/status");
        const { data } = res.data;
        updateCount = data.updateCount;
        if (updateCount !== 0) {
          setDescription(`파견학교 수정은 총 3회까지 가능합니다. ${updateCount - 1}/3`);
        }
      } catch (error) {
        console.error(error.toString());
        let errorMessage = error.toString();
        const detailedErrorMessage = error?.response?.data?.error?.message ?? "";
        if (detailedErrorMessage) errorMessage += "\n" + detailedErrorMessage;
        alert(errorMessage);
      }
    }
    fetchData();
  }, []);

  function handleBack() {
    if (currentStage === 2) {
      setCurrentStage(currentStage - 1);
      setProgress(0);
    }
  }

  function submitForm() {
    async function postData() {
      try {
        await apiClient.post("/application/university", {
          firstChoiceUniversityId: parseInt(firstCollege),
          secondChoiceUniversityId: parseInt(secondCollege),
        });
        router.push("/score/register");
      } catch (error) {
        console.error(error.toString());
        let errorMessage = error.toString();
        const detailedErrorMessage = error?.response?.data?.error?.message ?? "";
        if (detailedErrorMessage) errorMessage += "\n" + detailedErrorMessage;
        alert(errorMessage);
      }
    }
    // 서버로 데이터 전송
    postData();
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
            collegesKeyName={collegesKeyName}
            college={firstCollege}
            setCollege={setFirstCollege}
          />
        );
      case 2:
        return <FormCollege toNextStage={submitForm} text="2지망" collegesKeyName={collegesKeyName} college={secondCollege} setCollege={setSecondCollege} />;
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
        <ProgressBar style={{ padding: "11px 20px 0 20px" }} progress={progress} display="2/2" description={description} />
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

  const filePath = path.join(process.cwd(), "datas/24-2-key-name.json");
  const fileData = fs.readFileSync(filePath);
  const collegesKeyName = JSON.parse(fileData.toString());

  return {
    props: { collegesKeyName },
  };
}
