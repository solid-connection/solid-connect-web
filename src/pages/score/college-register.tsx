import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { getMyApplicationStatusApi, postApplicationUniversityApi } from "@/services/application";
import { getUniversityListPublicApi } from "@/services/university";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import FormCollege from "@/components/score/register/form-college";
import ProgressBar from "@/components/score/register/progress-bar";

import { ListUniversity } from "@/types/university";

type CollegeRegisterPageProps = {
  universityList: ListUniversity[];
};

export default function CollegeRegisterPage({ universityList }: CollegeRegisterPageProps) {
  const router = useRouter();
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [description, setDescription] = useState<string>("본 과정 완료 후, 지원자 현황을 확인 할 수 있습니다.");

  const [firstCollegeId, setFirstCollegeId] = useState<number>(null);
  const [secondCollegeId, setSecondCollegeId] = useState<number>(null);
  const [thirdCollegeId, setThirdCollegeId] = useState<number>(null);

  useEffect(() => {
    async function checkUpdateCount() {
      await getMyApplicationStatusApi()
        .then((res) => {
          if (res.data.updateCount !== 0) {
            setDescription(`파견학교 수정은 총 3회까지 가능합니다. ${res.data.updateCount}/3`);
          }
        })
        .catch((err) => {
          if (err.response) {
            console.error("Axios response error", err.response);
            if (err.response.status === 401 || err.response.status === 403) {
              alert("로그인이 필요합니다");
              document.location.href = "/login";
            } else {
              alert(err.response.data?.message);
            }
          } else {
            console.error("Error", err.message);
            alert(err.message);
          }
        });
    }
    checkUpdateCount();
  }, []);

  function handleBack() {
    if (currentStage !== 1) {
      setCurrentStage(currentStage - 1);
    }
  }

  function getProgress() {
    if (currentStage === 1) {
      return 33;
    }
    if (currentStage === 2) {
      return 66;
    }
    if (currentStage === 3) {
      return 100;
    }
  }

  function submitForm() {
    const postData = async () => {
      const applicationScore = {
        firstChoiceUniversityId: firstCollegeId,
        secondChoiceUniversityId: secondCollegeId,
        thirdChoiceUniversityId: thirdCollegeId,
      };

      await postApplicationUniversityApi(applicationScore)
        .then((res) => {
          alert("파견 희망학교를 제출했습니다");
          router.push("/score");
        })
        .catch((err) => {
          if (err.response) {
            console.error("Axios response error", err.response);
            if (err.response.status === 401 || err.response.status === 403) {
              alert("로그인이 필요합니다");
              document.location.href = "/login";
            } else {
              alert(err.response.data?.message);
            }
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
            }}
            text="1지망"
            universityList={universityList}
            collegeId={firstCollegeId}
            setCollegeId={setFirstCollegeId}
          />
        );
      case 2:
        return (
          <FormCollege
            toNextStage={() => {
              setCurrentStage(3);
            }}
            text="2지망"
            universityList={universityList}
            collegeId={secondCollegeId}
            setCollegeId={setSecondCollegeId}
          />
        );
      case 3:
        return (
          <FormCollege
            toNextStage={submitForm}
            text="3지망"
            universityList={universityList}
            collegeId={thirdCollegeId}
            setCollegeId={setThirdCollegeId}
          />
        );
      default:
        return <div>파견 희망대학을 제출했습니다!</div>;
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
          progress={getProgress()}
          display={`${currentStage}/3`}
          description={description}
        />
        {renderCurrentForm()}
      </div>
    </>
  );
}

export async function getStaticProps() {
  try {
    const res = await getUniversityListPublicApi();

    const universityList = res.data;
    return {
      props: { universityList: universityList },
      revalidate: 60,
    };
  } catch {
    return {
      props: { universityList: [] },
      revalidate: 1,
    };
  }
}
