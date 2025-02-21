type BlockBtnProps = {
  onClick: () => void;
  children: React.ReactNode;
};

const BlockBtn = ({ onClick, children }: BlockBtnProps) => (
  <button
    className="h-[3.125rem] w-full min-w-80 max-w-screen-sm rounded-lg bg-primary"
    onClick={onClick}
    type="button"
  >
    <span className="font-serif text-base font-medium text-white">{children}</span>
  </button>
);

export default BlockBtn;
