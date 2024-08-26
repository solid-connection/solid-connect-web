import { useRouter } from "next/router";
import { useRef, useState } from "react";

import { signUpApi } from "@/services/auth";
import { uploadProfileImageFilePublicApi } from "@/services/file";
import { convertBirth } from "@/utils/datetimeUtils";
import { saveAccessToken, saveRefreshToken } from "@/utils/localStorage";

import SignupPrepareScreen from "./signup-prepare-screen";
import SignupProfileScreen from "./signup-profile-screen";
import SignupRegionScreen from "./signup-region-screen";

import { Gender, GenderEnum, PreparationStatus, RegisterRequest } from "@/types/auth";
import { RegionKo } from "@/types/university";

type SignupSurveyProps = {
  kakaoOauthToken: string;
  kakaoNickname: string;
  kakaoEmail: string;
  kakaoProfileImageUrl: string;
};

export default function SignupSurvey({
  kakaoOauthToken,
  kakaoNickname,
  kakaoEmail,
  kakaoProfileImageUrl,
}: SignupSurveyProps) {
  const router = useRouter();
  const [curStage, setCurStage] = useState<number>(1);

  const [curPreparation, setCurPreparation] = useState<PreparationStatus | null>(null);

  const [region, setRegion] = useState<RegionKo | "아직 잘 모르겠어요" | null>(null);
  const [countries, setCountries] = useState<[string] | []>([]);

  const [nickname, setNickname] = useState<string>(kakaoNickname);
  const [gender, setGender] = useState<Gender | "">("");
  const [birth, setBirth] = useState<string>("");
  const [imageFile, setImageFile] = useState(null);

  const createRegisterRequest = (): RegisterRequest => {
    const submitRegion: [RegionKo] | [] = region === "아직 잘 모르겠어요" ? [] : [region];

    if (gender === "") {
      alert("성별을 선택해주세요");
      return;
    }

    let imageUrl: string | null = null;
    if (imageFile) {
      uploadProfileImageFilePublicApi(imageFile)
        .then((res) => {
          imageUrl = res.data.fileUrl;
        })
        .catch((err) => {
          console.error("Error", err.message);
          alert(err.message);
        });
    } else if (kakaoProfileImageUrl) {
      imageUrl = kakaoProfileImageUrl;
    }

    return {
      kakaoOauthToken: kakaoOauthToken,
      interestedRegions: submitRegion,
      interestedCountries: countries,
      preparationStatus: curPreparation,
      nickname: nickname,
      profileImageUrl: imageUrl,
      gender: gender,
      birth: birth,
    };
  };

  async function submitRegisterRequest() {
    try {
      const registerRequest: RegisterRequest = createRegisterRequest();
      await signUpApi(registerRequest).then((res) => {
        saveAccessToken(res.data.accessToken);
        saveRefreshToken(res.data.refreshToken);

        alert("회원가입이 완료되었습니다.");
        router.push("/");
      });
    } catch (err) {
      if (err.response) {
        console.error("Axios response error", err.response);
        alert(err.response.data?.message);
      } else {
        console.error("Error", err.message);
        alert(err.message);
      }
    }
  }

  const renderCurrentSurvey = () => {
    switch (curStage) {
      case 1:
        return (
          <SignupPrepareScreen preparation={curPreparation} setPreparation={setCurPreparation} setStage={setCurStage} />
        );
      case 2:
        return (
          <SignupRegionScreen
            curRegion={region}
            setCurRegion={setRegion}
            curCountries={countries}
            setCurCountries={setCountries}
            toNextStage={() => {
              if (!region) {
                alert("권역을 선택해주세요");
                return;
              }
              setCurStage(3);
            }}
          />
        );
      case 3:
        return (
          <SignupProfileScreen
            toNextStage={submitRegisterRequest}
            nickname={nickname}
            setNickname={setNickname}
            gender={gender}
            setGender={setGender}
            birth={birth}
            setBirth={setBirth}
            defaultProfileImageUrl={kakaoProfileImageUrl}
            imageFile={imageFile}
            setImageFile={setImageFile}
          />
        );
      default:
        return <div>회원 가입이 완료되었습니다</div>;
    }
  };

  return <>{renderCurrentSurvey()}</>;
}
