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

export default function BlockToggleBtn({
  children,
  className,
  style,
  backgroundColor,
  textColor,
  disableBackgroundColor,
  disableTextColor,
  onClick,
  isToggled = true,
}: BlockToggleBtnProps) {
  let defaultStyle = {
    backgroundColor: backgroundColor || "var(--primary-1, #6F90D1)",
    color: textColor || "white",

    width: "100%",
    height: "44px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.5s, color 0.5s",

    fontFamily: "Pretendard",
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: "normal",
  };

  if (!isToggled) {
    defaultStyle = {
      ...defaultStyle,
      backgroundColor: disableBackgroundColor || "#EDEDED",
      color: disableTextColor || "#888",
    };
  }

  return (
    <button className={className} style={{ ...defaultStyle, ...style }} onClick={onClick} type="button">
      {children}
    </button>
  );
}
