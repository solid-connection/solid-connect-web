import { useRouter } from "next/router";
import { useState } from "react";

import { updateMyNicknameApi } from "@/services/myInfo";

import BlockBtn from "@/components/ui/block-btn";

import { MAX_WIDTH } from "@/constants/meta";
import { MyInfo } from "@/types/myInfo";

type MyModifyFormProps = {
  myInfo: MyInfo;
};

const MyModifyForm = ({ myInfo }: MyModifyFormProps) => {
  const [nickname, setNickname] = useState<string>(myInfo.nickname);
  const router = useRouter();

  const updateNickname = async (newNickname: string) => {
    try {
      await updateMyNicknameApi(newNickname);
      alert("닉네임이 변경되었습니다");
      router.reload();
    } catch (err) {
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
    }
  };

  const handleNicknameChange = () => {
    if (confirm("닉네임은 7일에 한번만 변경 가능합니다. 정말로 변경하시겠습니까?")) {
      updateNickname(nickname);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-5 px-5">
        <MyModifyFormElement title="이름" value={nickname} setValue={setNickname} />
        <MyModifyFormElement title="생년월일" value={myInfo.birth || "1970. 01. 01"} />
        <MyModifyFormElement title="출신학교" value={"인하대학교"} />
        <MyModifyFormElement title="파견학교" value={"미상"} />
      </div>

      <BlockBtn
        style={{
          position: "fixed",
          bottom: "86px",
          width: "calc(100% - 60px)",
          maxWidth: MAX_WIDTH - 60,
          marginLeft: "30px",
        }}
        onClick={handleNicknameChange}
      >
        수정하기
      </BlockBtn>
    </>
  );
};

export default MyModifyForm;

type MyModifyFormElementProps = {
  title: string;
  value: string;
  setValue?: (value: string) => void;
};

const MyModifyFormElement = ({ title, value, setValue }: MyModifyFormElementProps) => {
  return (
    <div className="flex gap-8">
      <div className="text-black basis-14 font-serif text-base font-semibold">{title}</div>
      <input
        className="text-black w-full flex-1 border-0 border-b border-b-[#d2d2d2] pb-2.5 font-serif text-base font-normal outline-none"
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
};
