type CheveronRightFilledProps = {
  color?: string;
  opacity?: string;
  className?: string;
};

const CheveronRightFilled = ({ color = "black", opacity = "1", className }: CheveronRightFilledProps) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M9.70492 6L8.29492 7.41L12.8749 12L8.29492 16.59L9.70492 18L15.7049 12L9.70492 6Z"
      fill={color}
      fillOpacity={opacity}
    />
  </svg>
);

export default CheveronRightFilled;
