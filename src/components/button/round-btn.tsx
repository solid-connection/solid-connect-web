type RoundBtnProps = {
  className?: string;
  style?: React.CSSProperties;
  textColor?: string;
  backgroundColor?: string;
  onClick?: () => void;
  children: React.ReactNode;
};

const RoundBtn = ({ textColor, backgroundColor, onClick, style, className, children }: RoundBtnProps) => {
  const defaultStyle = {
    backgroundColor: backgroundColor || "var(--primary-1, #6F90D1)",
    color: textColor || "white",
    height: "40px",
    padding: "5px 12px",
    border: "none",
    borderRadius: "100px",
    // fontFeatureSettings: "clig off, liga off",
    fontFamily: "Pretendard",
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: "160%",
    cursor: "pointer",
  };

  return (
    <button className={className} style={{ ...defaultStyle, ...style }} onClick={onClick} type="button">
      {children}
    </button>
  );
};

export default RoundBtn;
