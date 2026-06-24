import BlockBtn from "@/components/button/BlockBtn";

type ApplicationBottomActionBarProps = {
  label: string;
  onClick: () => void;
};

const ApplicationBottomActionBar = ({ label, onClick }: ApplicationBottomActionBarProps) => {
  return (
    <div className="fixed bottom-[78px] left-1/2 w-full max-w-app -translate-x-1/2 px-5 md:bottom-0 md:left-[88px] md:w-[calc(100%-88px)] md:max-w-none md:translate-x-0 md:bg-white md:px-0">
      <div className="md:mb-[37px] md:px-5">
        <BlockBtn onClick={onClick}>{label}</BlockBtn>
      </div>
    </div>
  );
};

export default ApplicationBottomActionBar;
