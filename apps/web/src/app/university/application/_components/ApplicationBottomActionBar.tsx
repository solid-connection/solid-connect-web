import BlockBtn from "@/components/button/BlockBtn";

type ApplicationBottomActionBarProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

const ApplicationBottomActionBar = ({ label, onClick, disabled = false }: ApplicationBottomActionBarProps) => {
  return (
    <div className="fixed bottom-[78px] left-1/2 w-full max-w-app -translate-x-1/2 px-5">
      <BlockBtn onClick={onClick} disabled={disabled}>
        {label}
      </BlockBtn>
    </div>
  );
};

export default ApplicationBottomActionBar;
