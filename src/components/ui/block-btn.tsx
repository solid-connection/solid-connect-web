export default function BlockBtn(props) {
  const { backgroundColor, textColor, onClick } = props;
  const style = {
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
    <button className={props.className} style={{ ...style, ...props.style }} onClick={onClick}>
      {props.children}
    </button>
  );
}
