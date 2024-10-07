type BlockBtnProps = {
  backgroundColor?: string;
  textColor?: string;
  onClick: () => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
};

export default function BlockBtn({ backgroundColor, textColor, onClick, children, style, className }: BlockBtnProps) {
  const defaultStyle = {
    backgroundColor: backgroundColor || "var(--primary-1, #6F90D1)",
    color: textColor || "white",

    width: "100%",
    height: "44px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",

    fontFamily: "Pretendard",
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: "normal",
  };

  return (
    <button className={className} style={{ ...defaultStyle, ...style }} onClick={onClick} type="button">
      {children}
    </button>
  );
}
