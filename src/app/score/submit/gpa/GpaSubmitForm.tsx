"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { postGpaScoreApi } from "@/services/score";

import BlockBtn from "@/components/button/BlockBtn";
import RoundBtn from "@/components/button/RoundBtn";

const GpaSubmitForm = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [gpaCriteria, setGpaCriteria] = useState<number | null>(null);
  const [gpa, setGpa] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const submitForm = () => {
    if (!gpaCriteria) {
      alert("학점 기준을 선택해주세요.");
      return;
    }
    if (!gpa) {
      alert("점수를 입력해주세요.");
      return;
    }
    if (!file) {
      alert("증명서를 첨부해주세요.");
      return;
    }

    // 점수 유효성 검사
    if (Number(gpa) > gpaCriteria) {
      alert("학점 기준을 초과했습니다.");
      return;
    }

    async function postData() {
      try {
        const res = await postGpaScoreApi({
          gpaScoreRequest: {
            gpa: Number(gpa),
            gpaCriteria: gpaCriteria as number,
            issueDate: "2025-01-01",
          },
          file: file as File,
        });

        router.push("/score");
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
    }
    postData();
  };

  // TODO: 드롭박스 커스텀 디자인 적용

  return (
    <>
      <div className="px-5 pt-[30px]">
        <div>
          <p className="font-serif text-[22px] font-bold leading-normal text-k-900">대학교 성적 입력</p>
          <p className="font-serif text-[13px] font-medium leading-normal text-k-600">
            공적 증명서만 인정됩니다.
            <br />
            미인정 서류를 업로드 할 경우 권한이 거부될 수 있습니다.
          </p>
        </div>

        <div className="mt-[30px] flex flex-col gap-3.5">
          <div className="flex flex-col gap-1">
            <label className="font-serif text-base font-semibold leading-normal">학점 기준</label>
            <select
              className="flex h-10 items-center rounded-lg bg-k-50 px-5 py-2.5 font-serif text-sm font-semibold leading-normal text-secondary"
              value={gpaCriteria || ""}
              onChange={(e) => setGpaCriteria(Number(e.target.value))}
            >
              <option></option>
              <option>4.5</option>
              <option>4.3</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-serif text-base font-semibold leading-normal">점수</label>
            <input
              type="text"
              className="flex h-10 items-center rounded-lg bg-k-50 px-5 py-2.5 font-serif text-sm font-semibold leading-normal text-secondary"
              value={gpa || ""}
              onChange={(e) => setGpa(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-serif text-base font-semibold leading-normal">증명서 첨부</label>
            <span className="flex h-10 items-center rounded-lg bg-k-50 px-5 py-2.5 font-serif text-sm font-semibold leading-normal text-secondary">
              {file?.name}
            </span>
            <input
              type="file"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={() => {
                const file = fileInputRef.current?.files?.[0];
                if (file) {
                  setFile(file);
                }
              }}
            />
            <div className="mt-[30px] flex gap-[9px]">
              <RoundBtn variant={file ? "default" : "inactive"} onClick={() => fileInputRef.current?.click()}>
                파일 첨부하기
              </RoundBtn>
              <Link href="/score/example/gpa-cert" target="_blank">
                <RoundBtn variant="secondary-400">증명서 예시</RoundBtn>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-24 w-full max-w-[600px] px-5">
        <BlockBtn onClick={submitForm}>다음</BlockBtn>
      </div>
    </>
  );
};

export default GpaSubmitForm;
