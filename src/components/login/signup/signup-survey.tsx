import { useState } from "react";
import { useRouter } from "next/router";

import { Region } from "@/types/college";
import { RegisterRequest, PreparationStatus } from "@/types/auth";

import Survey1 from "./survey-1";
import Survey2 from "./survey-2";
import Survey3 from "./survey-3";
import { signUpApi } from "@/services/auth";

export default function SignupSurvey(props) {
  const { kakaoOauthToken, kakaoNickname, kakaoEmail, kakaoProfileImageUrl } = props;
  const [stage, setStage] = useState(1);
  // 1. region: 미주권, 아시아권, 유럽권, 중국권
  const [region, setRegion] = useState<Region | null>(null);
  // 2. countries: 미국, 캐나다, 일본, 독일, 프랑스, 중국...
  const [countries, setCountries] = useState([]);
  // 3. 준비 단계: "CONSIDERING" | "PREPARING_FOR_DEPARTURE" | "STUDYING_ABROAD"
  const [preparation, setPreparation] = useState<PreparationStatus>("CONSIDERING");
  const [nickname, setNickname] = useState<string>(kakaoNickname);
  const [profileImageUrl, setProfileImageUrl] = useState<string>(kakaoProfileImageUrl);
  const [gender, setGender] = useState("비공개");
  const [birth, setBirth] = useState<string>("2000-01-01");

  const router = useRouter();

  const genderConvertDict = {
    남성: "MALE",
    여성: "FEMALE",
    비공개: "PREFER_NOT_TO_SAY",
  };

  const registerRequest: RegisterRequest = {
    kakaoOauthToken: kakaoOauthToken,
    interestedRegions: [region],
    interestedCountries: countries,
    preparationStatus: preparation,
    nickname: nickname,
    profileImageUrl: profileImageUrl,
    gender: genderConvertDict[gender],
    birth: birth,
  };

  async function submitSurvey() {
    await signUpApi(registerRequest)
      .then((res) => {
        if (res.data.success == false) throw new Error(res.data.error.message);
        localStorage.setItem("accessToken", res.data.data.accessToken);
        localStorage.setItem("refreshToken", res.data.data.refreshToken);

        alert("회원가입이 완료되었습니다.");
        router.push("/");
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

  const renderCurrentSurvey = () => {
    switch (stage) {
      case 1:
        return <Survey1 setStage={setStage} region={region} setRegion={setRegion} />;
      case 2:
        return <Survey2 setStage={setStage} countries={countries} setCountries={setCountries} region={region} />;
      case 3:
        return (
          <Survey3
            submitSurvey={submitSurvey}
            preparation={preparation}
            setPreparation={setPreparation}
            nickname={nickname}
            setNickname={setNickname}
            profileImageUrl={profileImageUrl}
            setProfileImageUrl={setProfileImageUrl}
            gender={gender}
            setGender={setGender}
            birth={birth}
            setBirth={setBirth}
          />
        );
      default:
        return <div>Survey Completed!</div>;
    }
  };

  return <>{renderCurrentSurvey()}</>;
}
