import BlockBtn from "@/components/button/BlockBtn";

type ApplicationBottomActionBarProps = {
  label: string;
  onClick: () => void;
};

const ApplicationBottomActionBar = ({ label, onClick }: ApplicationBottomActionBarProps) => {
  return (
    <div className="fixed bottom-14 w-full max-w-app bg-white md:bottom-0 md:left-[88px] md:w-[calc(100%-88px)] md:max-w-none">
      <div className="mb-[37px] px-5">
        <BlockBtn onClick={onClick}>{label}</BlockBtn>
      </div>
    </div>
  );
};

export default ApplicationBottomActionBar;
