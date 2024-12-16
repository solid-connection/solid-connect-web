import Head from "next/head";
import { useEffect, useState } from "react";

import { getMyApplicationStatusApi, postApplicationUniversityApi } from "@/services/application";
import { getUniversityListPublicApi } from "@/services/university";

import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import NotFound from "@/components/loading/NotFound";
import CollegeFinalScreen from "@/components/score/register/college-final-screen";
import CollegeFormScreen from "@/components/score/register/college-form-screen";
import ProgressBar from "@/components/score/register/progress-bar";

import { ListUniversity } from "@/types/university";

type CollegeRegisterPageProps = {
  universityList: ListUniversity[];
};

const CollegeRegisterPage = ({ universityList }: CollegeRegisterPageProps) => {
  return (
    <a href="/" className="flex h-screen items-center justify-center pb-40">
      <NotFound text="현재 이용 가능 기간이 아닙니다" />
    </a>
  );
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [description, setDescription] = useState<string>("본 과정 완료 후, 지원자 현황을 확인 할 수 있습니다.");

  const [firstCollegeId, setFirstCollegeId] = useState<number | null>(null);
  const [secondCollegeId, setSecondCollegeId] = useState<number | null>(null);
  const [thirdCollegeId, setThirdCollegeId] = useState<number | null>(null);

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
    if (currentStage === 4) {
      return;
    }
    if (currentStage !== 1) {
      setCurrentStage(currentStage - 1);
    }
  }

  function getProgress() {
    if (currentStage === 1) {
      return 25;
    }
    if (currentStage === 2) {
      return 50;
    }
    if (currentStage === 3) {
      return 75;
    }
    return 100;
  }

  function submitForm() {
    const postData = async () => {
      if (firstCollegeId === null || secondCollegeId === null || thirdCollegeId === null) {
        alert("지망 학교를 모두 선택해주세요");
        return;
      }

      const applicationScore = {
        firstChoiceUniversityId: firstCollegeId,
        secondChoiceUniversityId: secondCollegeId,
        thirdChoiceUniversityId: thirdCollegeId,
      };

      await postApplicationUniversityApi(applicationScore)
        .then(() => {
          setCurrentStage(4);
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
          <CollegeFormScreen
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
          <CollegeFormScreen
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
          <CollegeFormScreen
            toNextStage={() => {
              submitForm();
            }}
            text="3지망"
            universityList={universityList}
            collegeId={thirdCollegeId}
            setCollegeId={setThirdCollegeId}
          />
        );
      case 4:
        return <CollegeFinalScreen />;
      default:
        return <div>파견 희망대학을 제출했습니다!</div>;
    }
  }
  return (
    <>
      <Head>
        <title>지원하기</title>
      </Head>
      <TopDetailNavigation
        title="지원하기"
        handleBack={() => {
          handleBack();
        }}
      />
      <div style={{ height: "calc(100vh - 112px)", display: "flex", flexDirection: "column" }}>
        <ProgressBar
          style={{ padding: "11px 20px 0 20px" }}
          progress={getProgress()}
          display={`${currentStage}/4`}
          description={description}
        />
        {renderCurrentForm()}
      </div>
    </>
  );
};

export default CollegeRegisterPage;

export async function getStaticProps() {
  try {
    const res = await getUniversityListPublicApi();

    const universityList = res.data;
    return {
      props: { universityList },
      revalidate: 60,
    };
  } catch {
    return {
      props: { universityList: [] },
      revalidate: 1,
    };
  }
}
