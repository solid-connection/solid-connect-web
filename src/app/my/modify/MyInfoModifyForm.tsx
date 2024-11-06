"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { updateMyNicknameApi } from "@/services/myInfo";

import BlockBtn from "@/components/button/BlockBtn";
import ConfirmCancelModal from "@/components/modal/ConfirmCancelModal";

import { MyInfo } from "@/types/myInfo";

import { useAlert } from "@/context/AlertContext";

type MyInfoModifyFormProps = {
  myInfo: MyInfo;
};

const MyInfoModifyForm = ({ myInfo }: MyInfoModifyFormProps) => {
  const [nickname, setNickname] = useState<string>(myInfo.nickname);
  const [isChangeModalOpen, setIsChangeModalOpen] = useState<boolean>(false);
  const router = useRouter();
  const { alert } = useAlert();

  const updateNickname = async (newNickname: string) => {
    try {
      setIsChangeModalOpen(false);
      await updateMyNicknameApi(newNickname);
      await alert("닉네임이 변경되었습니다");
      router.refresh();
    } catch (err) {
      if (err.response) {
        console.error("Axios response error", err.response);
        if (err.response.status === 401 || err.response.status === 403) {
          await alert("로그인이 필요합니다");
          document.location.href = "/login";
        } else {
          await alert(err.response.data?.message);
        }
      } else {
        console.error("Error", err.message);
        await alert(err.message);
      }
    }
  };

  const convertBirthFormat = (birth: string) => {
    // 1970-01-01 -> 1970.1.1
    if (birth === null) {
      return null;
    }
    const [year, month, day] = birth.split("-");
    return `${year}.${parseInt(month)}.${parseInt(day)}`;
  };

  return (
    <>
      <div className="flex flex-col gap-5 px-5">
        <MyInfoModifyFormElement title="이름" value={nickname} setValue={setNickname} />
        {/* <MyInfoModifyFormElement title="성별" value="성별 값" /> */}
        <MyInfoModifyFormElement title="생년월일" value={convertBirthFormat(myInfo.birth) || "1970.1.1"} />
        <MyInfoModifyFormElement title="출신학교" value="인하대학교" />
        <MyInfoModifyFormElement title="파견학교" value="미상" />
        <MyInfoModifyFormElement title="활동" value="Mentee" />
      </div>

      <div className="fixed bottom-24 w-full max-w-[600px] px-5">
        <BlockBtn
          onClick={() => {
            setIsChangeModalOpen(true);
          }}
        >
          저장하기
        </BlockBtn>
      </div>
      <ConfirmCancelModal
        isOpen={isChangeModalOpen}
        title="닉네임 변경"
        content="닉네임은 7일에 한번만 변경 가능합니다. 정말로 변경하시겠습니까?"
        handleConfirm={() => {
          updateNickname(nickname);
        }}
        handleCancel={() => {
          setIsChangeModalOpen(false);
        }}
      />
    </>
  );
};

export default MyInfoModifyForm;

type MyInfoModifyFormElementProps = {
  title: string;
  value: string;
  setValue?: (value: string) => void;
};

const MyInfoModifyFormElement = ({ title, value, setValue }: MyInfoModifyFormElementProps) => (
  <div className="flex items-center gap-8">
    <div className="basis-14 font-serif text-base font-semibold text-black">{title}</div>
    <input
      className="h-10 w-full flex-1 rounded-md bg-[#f7f8fa] px-5 py-3 font-serif text-sm font-medium text-black outline-none"
      type="text"
      value={value}
      onChange={(e) => {
        if (setValue) {
          setValue(e.target.value);
        }
      }}
      disabled={!setValue}
    />
  </div>
);
