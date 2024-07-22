import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import fs from "fs";
import path from "path";

import { getMyApplicationStatusApi, postApplicationUniversityApi } from "@/services/application";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import FormCollege from "@/components/score/register/form-college";
import ProgressBar from "@/components/score/register/progress-bar";

export default function CollegeRegisterPage({ collegesKeyName }) {
  const router = useRouter();
  const [progress, setProgress] = useState<number>(0);
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [description, setDescription] = useState<string>("본 과정 완료 후, 지원자 현황을 확인 할 수 있습니다.");

  const [firstCollege, setFirstCollege] = useState<string>("");
  const [secondCollege, setSecondCollege] = useState<string>("");

  useEffect(() => {
    let updateCount = 0;

    async function checkUpdateCount() {
      await getMyApplicationStatusApi()
        .then((res) => {
          if (res.data.updateCount !== 0) {
            setDescription(`파견학교 수정은 총 3회까지 가능합니다. ${updateCount - 1}/3`);
          }
        })
        .catch((err) => {
          if (err.response) {
            console.error("Axios response error", err.response.data);
            alert(err.response.data?.error?.message);
          } else if (err.reqeust) {
            console.error("Axios request error", err.request);
          } else {
            console.error("Error", err.message);
            alert(err.message);
          }
        });
    }
    checkUpdateCount();
  }, []);

  function handleBack() {
    if (currentStage === 2) {
      setCurrentStage(currentStage - 1);
      setProgress(0);
    }
  }

  function submitForm() {
    const postData = async () => {
      const applicationScore = {
        firstChoiceUniversityId: parseInt(firstCollege),
        secondChoiceUniversityId: parseInt(secondCollege),
      };

      await postApplicationUniversityApi(applicationScore)
        .then((res) => {
          router.push("/score");
        })
        .catch((err) => {
          if (err.response) {
            console.error("Axios response error", err.response.data);
            alert(err.response.data?.error?.message);
          } else if (err.reqeust) {
            console.error("Axios request error", err.request);
          } else {
            console.error("Error", err.message);
            alert(err.message);
          }
        });
    };
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
        return (
          <FormCollege
            toNextStage={submitForm}
            text="2지망"
            collegesKeyName={collegesKeyName}
            college={secondCollege}
            setCollege={setSecondCollege}
          />
        );
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
        <ProgressBar
          style={{ padding: "11px 20px 0 20px" }}
          progress={progress}
          display="2/2"
          description={description}
        />
        {renderCurrentForm()}
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const filePath = path.join(process.cwd(), "datas/24-2-key-name.json");
  const fileData = fs.readFileSync(filePath);
  const collegesKeyName = JSON.parse(fileData.toString());

  return {
    props: { collegesKeyName },
  };
}
