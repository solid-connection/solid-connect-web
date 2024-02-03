export default function RoundBtn(props) {
  const { textColor, backgroundColor, onClick } = props;
  const style = {
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
    <button className={props.className} style={{ ...style, ...props.style }} onClick={onClick}>
      {props.children}
    </button>
  );
}
