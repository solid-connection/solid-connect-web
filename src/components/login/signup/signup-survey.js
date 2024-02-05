import { useState } from "react";
import { useRouter } from "next/router";

import Survey1 from "./survey-1";
import Survey2 from "./survey-2";
import Survey3 from "./survey-3";

export default function SignupSurvey(props) {
  const { kakaoOauthToken, kakaoNickname, kakaoEmail, kakaoProfileImageUrl } = props;
  const [stage, setStage] = useState(1);
  // 1. region: 미주권, 아시아권, 유럽권, 중국권
  const [region, setRegion] = useState("");
  // 2. countries: 미국, 캐나다, 일본, 독일, 프랑스, 중국...
  const [countries, setCountries] = useState([]);
  // 3. 준비 단계: "CONSIDERING" | "PREPARING_FOR_DEPARTURE" | "STUDYING_ABROAD"
  const [preparation, setPreparation] = useState("CONSIDERING");
  const [nickname, setNickname] = useState(kakaoNickname);
  const [profileImageUrl, setProfileImageUrl] = useState(kakaoProfileImageUrl);

  const router = useRouter();

  async function submitSurvey() {
    const response = await fetch("/api/auth/complete-register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        kakaoOauthToken: kakaoOauthToken,
        interestedRegions: [region],
        interestedCountries: countries,
        preparationStatus: preparation,
        nickname: nickname,
        profileImageUrl: "http://k.kakaocdn.net/dn/Vu7Ns/btszpzg5KD6/ChzJDcvSxWeZ93VX2AelD0/img_640x640.jpg",
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error("가입중 오류 발생, 닉네임 중복등");
    }

    if (data.success) {
      console.log("가입성공");
      router.push("/");
    }
  }

  const renderCurrentSurvey = () => {
    switch (stage) {
      case 1:
        return <Survey1 setStage={setStage} region={region} setRegion={setRegion} />;
      case 2:
        return <Survey2 setStage={setStage} countries={countries} setCountries={setCountries} region={region} />;
      case 3:
        return <Survey3 submitSurvey={submitSurvey} preparation={preparation} setPreparation={setPreparation} nickname={nickname} setNickname={setNickname} profileImageUrl={profileImageUrl} setProfileImageUrl={setProfileImageUrl} />;
      default:
        return <div>Survey Completed!</div>;
    }
  };

  return <div>{renderCurrentSurvey()}</div>;
}
