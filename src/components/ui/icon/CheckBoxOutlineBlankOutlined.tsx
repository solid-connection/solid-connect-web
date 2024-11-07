type CheckBoxOutlineBlankOutlinedProps = {
  style?: React.CSSProperties;
  size?: number;
};

const CheckBoxOutlineBlankOutlined = ({ style, size }: CheckBoxOutlineBlankOutlinedProps) => (
  <svg
    style={style}
    xmlns="http://www.w3.org/2000/svg"
    width={size || 24}
    height={size || 24}
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M19 5V19H5V5H19ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z"
      fill="black"
      fillOpacity="0.54"
    />
  </svg>
);

export default CheckBoxOutlineBlankOutlined;
