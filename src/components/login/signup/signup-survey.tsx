import { useRouter } from "next/router";
import { useRef, useState } from "react";

import { signUpApi } from "@/services/auth";
import { uploadProfileImageFilePublicApi } from "@/services/file";
import { convertBirth } from "@/utils/datetimeUtils";
import { saveAccessToken, saveRefreshToken } from "@/utils/localStorage";

import SignupPrepareScreen from "./signup-prepare-screen";
import SignupProfileScreen from "./signup-profile-screen";
import SignupRegionScreen from "./signup-region-screen";

import { PreparationStatus, RegisterRequest } from "@/types/auth";
import { RegionKo } from "@/types/university";

export default function SignupSurvey(props) {
  const { kakaoOauthToken, kakaoNickname, kakaoEmail, kakaoProfileImageUrl } = props;
  const [stage, setStage] = useState<number>(1);
  const [region, setRegion] = useState<RegionKo | "아직 잘 모르겠어요" | null>(null);
  const [countries, setCountries] = useState<[string] | []>([]);
  const [preparation, setPreparation] = useState<PreparationStatus | null>(null);

  const [nickname, setNickname] = useState<string>(kakaoNickname);
  const genderRef = useRef<HTMLSelectElement>(null);
  const birthRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState(null);

  const router = useRouter();

  const converGender = (value: string): "MALE" | "FEMALE" | "PREFER_NOT_TO_SAY" => {
    if (value === "MALE" || value === "FEMALE" || value === "PREFER_NOT_TO_SAY") {
      return value;
    }
    throw new Error("성별을 선택해주세요");
  };

  const createRegisterRequest = (): RegisterRequest => {
    const submitRegion: [RegionKo] | [] = region === "아직 잘 모르겠어요" ? [] : [region];

    const birth = convertBirth(birthRef.current.value);
    const gender = converGender(genderRef.current.value);

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
      preparationStatus: preparation,
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
        console.error("Axios response error", err.response.data);
        alert(err.response.data?.error?.message);
      } else if (err.reqeust) {
        console.error("Axios request error", err.request);
      } else {
        console.error("Error", err.message);
        alert(err.message);
      }
    }
  }

  const renderCurrentSurvey = () => {
    switch (stage) {
      case 1:
        return <SignupPrepareScreen preparation={preparation} setPreparation={setPreparation} setStage={setStage} />;
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
              setStage(3);
            }}
          />
        );
      case 3:
        return (
          <SignupProfileScreen
            toNextStage={submitRegisterRequest}
            nickname={nickname}
            setNickname={setNickname}
            genderRef={genderRef}
            birthRef={birthRef}
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
