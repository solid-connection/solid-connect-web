import CloudSpinner from "./CloudSpinner";

const CloudSpinnerPage = () => (
  <div className="flex h-screen items-center justify-center pb-40">
    <div className="flex flex-col items-center">
      <CloudSpinner />
      <div className="mt-8 font-serif text-xs text-[#707070]">교환학생의 첫 걸음</div>
      <div className="font-serif text-[17px] font-semibold">솔리드 커넥션</div>
    </div>
  </div>
);

export default CloudSpinnerPage;
