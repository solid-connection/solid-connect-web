import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import BlockBtn from "@/components/ui/block-btn";
import Head from "next/head";
import Image from "next/image";

export default function GpaCertExamplePage() {
  const closeWiindow: () => void = () => {
    window.close();
  };
  const div = {
    padding: "33px 20px 36px 20px",
    borderBottom: "1px solid #ECECEC",
    color: "#1E1E1E",
    fontFamily: "Pretendard",
    fontSize: "14px",
    lineHeight: "150%",
  };
  const h1 = {
    display: "block",
    color: "#1E1E1E",
    fontFamily: "Pretendard",
    fontSize: "18px",
    fontWeight: 700,
    lineHeight: "150%",
  };
  const h3 = {
    marginTop: "30px",
    display: "block",
    color: "#1E1E1E",
    fontFamily: "Pretendard",
    fontSize: "14px",
    lineHeight: "150%",
  };
  return (
    <>
      <Head>
        <title>증명서 예시</title>
      </Head>
      <div>
        <TopDetailNavigation title="증명서 예시" handleBack={closeWiindow} />
        <div style={div}>
          학번과 직전학기가 표시된 증명서만 승인됩니다.
          <br />
          <br />
          증명서 포털에서 발급되는 성적표 또는 인하대 수강신청 또는 앱에서 직전학기 성적이 명시된 스크린 샷 허용
        </div>
        <div style={{ margin: "23px 20px 0 20px" }}>
          <span style={h1}>성적 증명서 발급 방법</span>
          <span style={h3}>1. 인하대 포털 {">"} 학사행정</span>
          <Image style={{ marginTop: "10px" }} src="/images/gpa-cert-example-1.png" width={162} height={76} alt="성적 증명서 발급 방법" />
          <span style={h3}>2. 성적 {">"} 성적 및 석차 확인</span>
          <Image style={{ marginTop: "10px" }} src="/images/gpa-cert-example-2.png" width={177} height={80} alt="성적 증명서 발급 방법" />
          <span style={h3}>3. PDF 다운로드</span>
          <Image style={{ marginTop: "10px" }} src="/images/gpa-cert-example-3.png" width={291} height={68} alt="성적 증명서 발급 방법" />
          <span style={h3}>4. 파일 첨부하기 버튼 {">"} 업로드 완료</span>
        </div>
        <div style={{ margin: "60px 20px 0 20px" }}>
          <BlockBtn onClick={closeWiindow}>닫기</BlockBtn>
        </div>
      </div>
    </>
  );
}
