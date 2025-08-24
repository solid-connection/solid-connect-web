import TopDetailNavigation from "@/components/layout/TopDetailNavigation";

export const metadata = {
  title: "이용약관",
  description: "솔리드커넥션 서비스 이용약관 페이지입니다.",
};

const TermsPage = () => {
  return (
    <>
      <TopDetailNavigation title="이용약관" />
      <div className="px-5 py-6">
        <ol className="font-pretendard ml-4 list-decimal space-y-2 text-[13px] font-normal leading-[19.5px] text-black">
          <li>회원은 언제든지 서비스 내 제공되는 탈퇴 절차를 통해 이용계약을 해지할 수 있습니다.</li>
          <li>
            회원이 탈퇴를 요청할 경우, 회사는 관련 법령 및 개인정보처리방침에 따라 회원의 개인정보를 일정 기간
            보유하거나 즉시 파기합니다.
          </li>
          <li>
            탈퇴 시, 회원이 솔리드커넥션 내에서 보유한 모든 정보(프로필, 매칭 이력, 메시지 내역, 포인트 등)는 삭제되며,
            삭제된 정보는 복구할 수 없습니다. 단, 회사가 관련 법령에 따라 보존해야 하는 정보는 예외로 합니다.
          </li>
          <li>
            회원이 탈퇴할 경우, 매칭 진행 중이던 모든 연결은 자동 종료되며, 이에 따른 책임은 회사가 부담하지 않습니다.
          </li>
          <li>
            유료 서비스 이용 중 탈퇴하는 경우, 별도의 환불은 제공되지 않으며, 환불 기준은 별도 정책 또는 이용약관에서
            정한 바에 따릅니다.
          </li>
          <li>탈퇴 후 동일 계정(이메일 등)으로의 재가입은 일정 기간 제한될 수 있습니다.</li>
        </ol>
      </div>
    </>
  );
};

export default TermsPage;
