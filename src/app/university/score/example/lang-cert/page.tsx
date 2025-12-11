"use client";

import Image from "next/image";

import BlockBtn from "@/components/button/BlockBtn";
import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

const GpaCertExamplePage = () => {
  const closeWindow = () => {
    window.close();
  };

  const divStyle = {
    padding: "33px 20px 27px 20px",
    fontFamily: "Pretendard",
    fontSize: "14px",
    lineHeight: "150%",
  };

  return (
    <div className="w-full">
      <TopDetailNavigation title="증명서 예시" handleBack={closeWindow} />
      <div style={divStyle} className="text-gray-800">
        공인 어학 성적은 해당 홈페이지를 통해
        <br />
        공식 인증 기간 마크가 포함된 파일의 원본을 제출해주세요.
        <br />
        <br />* 본교 교환학생을 지원할때, 제출해야 하는 동일한 공인어학 점수 파일입니다.
      </div>
      <div style={{ margin: "0 20px 0 20px" }}>
        <Image src="/images/lang-cert-example-1.png" width={323} height={337} alt="성적 증명서 발급 방법" />
      </div>
      <div style={{ margin: "60px 20px 0 20px" }}>
        <BlockBtn onClick={closeWindow}>닫기</BlockBtn>
      </div>
    </div>
  );
};

export default GpaCertExamplePage;
