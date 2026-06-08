type BlockToggleBtnProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  backgroundColor?: string;
  textColor?: string;
  disableBackgroundColor?: string;
  disableTextColor?: string;
  onClick?: () => void;
  isToggled?: boolean;
};

const BlockToggleBtn = ({
  children,
  className = "",
  style,
  backgroundColor,
  textColor,
  disableBackgroundColor,
  disableTextColor,
  onClick,
  isToggled = true,
}: BlockToggleBtnProps) => {
  // CSS 변수 대신 Tailwind 클래스 사용
  const baseClasses =
    "w-full h-11 border-none rounded-lg cursor-pointer transition-all duration-500 typo-medium-1 font-serif";
  const enabledClasses = isToggled ? "bg-primary text-white" : "bg-gray-200 text-gray-500";

  const customStyles = {
    backgroundColor: isToggled ? backgroundColor : disableBackgroundColor,
    color: isToggled ? textColor : disableTextColor,
    ...style,
  };

  return (
    <button
      className={`${baseClasses} ${enabledClasses} ${className}`}
      style={customStyles}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
};

export default BlockToggleBtn;
