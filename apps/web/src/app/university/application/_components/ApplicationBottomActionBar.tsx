import BlockBtn from "@/components/button/BlockBtn";

type ApplicationBottomActionBarProps = {
  label: string;
  onClick: () => void;
};

const ApplicationBottomActionBarBase = ({
  label,
  onClick,
  isDesktop,
}: ApplicationBottomActionBarProps & { isDesktop: boolean }) => {
  if (isDesktop) {
    return (
      <div className="mt-8">
        <BlockBtn onClick={onClick}>{label}</BlockBtn>
      </div>
    );
  }

  return (
    <div className="fixed bottom-[78px] left-1/2 w-full max-w-app -translate-x-1/2 px-5 md:bottom-0 md:left-[88px] md:w-[calc(100%-88px)] md:max-w-none md:translate-x-0">
      <BlockBtn onClick={onClick}>{label}</BlockBtn>
    </div>
  );
};

export const DesktopApplicationBottomActionBar = (props: ApplicationBottomActionBarProps) => (
  <ApplicationBottomActionBarBase {...props} isDesktop />
);

export const MobileApplicationBottomActionBar = (props: ApplicationBottomActionBarProps) => (
  <ApplicationBottomActionBarBase {...props} isDesktop={false} />
);

export default MobileApplicationBottomActionBar;
