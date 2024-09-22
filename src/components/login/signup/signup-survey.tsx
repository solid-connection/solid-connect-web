import { useRouter } from "next/router";
import { useState } from "react";

import { signUpApi } from "@/services/auth";
import { uploadProfileImageFilePublicApi } from "@/services/file";
import { saveAccessToken, saveRefreshToken } from "@/utils/localStorage";

import SignupPrepareScreen from "./signup-prepare-screen";
import SignupProfileScreen from "./signup-profile-screen";
import SignupRegionScreen from "./signup-region-screen";

import { Gender, PreparationStatus, RegisterRequest } from "@/types/auth";
import { RegionKo } from "@/types/university";

type SignupSurveyProps = {
  kakaoOauthToken: string;
  kakaoNickname: string;
  kakaoEmail: string;
  kakaoProfileImageUrl: string;
};

const convertBirth = (value: string): string => {
  // 20010101 방식의 생년월일을 "YYYY-MM-DD" 형식으로 변환
  // 입력값이 8자리인지 확인
  if (value.length !== 8) {
    throw new Error("생년월일을 8자리로 입력해주세요.");
  }

  // 년, 월, 일을 분리
  const year = value.substring(0, 4);
  const month = value.substring(4, 6);
  const day = value.substring(6, 8);

  // "YYYY-MM-DD" 형식으로 변환
  const formattedDate = `${year}-${month}-${day}`;

  // 날짜 유효성 검증
  const date = new Date(formattedDate);
  const isValidDate =
    date.getFullYear() === parseInt(year, 10) &&
    date.getMonth() + 1 === parseInt(month, 10) &&
    date.getDate() === parseInt(day, 10);

  if (!isValidDate) {
    throw new Error("유효한 날짜가 아닙니다.");
  }

  return formattedDate;
};

export default function SignupSurvey({
  kakaoOauthToken,
  kakaoNickname,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  const [profileImageFile, setProfileImageFile] = useState(null);

  const createRegisterRequest = (): RegisterRequest => {
    const submitRegion: [RegionKo] | [] = region === "아직 잘 모르겠어요" ? [] : [region];

    if (!curPreparation) {
      throw new Error("준비 단계를 선택해주세요");
    }

    if (gender === "") {
      throw new Error("성별을 선택해주세요");
    }

    const convertedBirth: string = convertBirth(birth);

    let imageUrl: string | null = null;
    if (profileImageFile) {
      uploadProfileImageFilePublicApi(profileImageFile)
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
      kakaoOauthToken,
      interestedRegions: submitRegion,
      interestedCountries: countries,
      preparationStatus: curPreparation,
      nickname,
      profileImageUrl: imageUrl,
      gender,
      birth: convertedBirth,
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
          <SignupPrepareScreen
            preparation={curPreparation}
            setPreparation={setCurPreparation}
            toNextStage={() => {
              setCurStage(2);
            }}
          />
        );
      case 2:
        return (
          <SignupRegionScreen
            curRegion={region}
            setCurRegion={setRegion}
            curCountries={countries}
            setCurCountries={setCountries}
            toNextStage={() => {
              setCurStage(3);
            }}
          />
        );
      case 3:
        return (
          <SignupProfileScreen
            toNextStage={() => {
              submitRegisterRequest();
            }}
            nickname={nickname}
            setNickname={setNickname}
            gender={gender}
            setGender={setGender}
            birth={birth}
            setBirth={setBirth}
            defaultProfileImageUrl={kakaoProfileImageUrl}
            profileImageFile={profileImageFile}
            setProfileImageFile={setProfileImageFile}
          />
        );
      default:
        return <div>회원 가입이 완료되었습니다</div>;
    }
  };

  return <>{renderCurrentSurvey()}</>;
}
