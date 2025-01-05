type RoundBtnProps = {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
};

const RoundBtn = ({ onClick, className, children }: RoundBtnProps) => {
  return (
    <button
      className={`${"h-10 w-[102px] rounded-full px-3 py-[5px] font-serif text-xs font-bold leading-normal"} ${className || ""}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
};

export default RoundBtn;
