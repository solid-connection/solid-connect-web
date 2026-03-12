interface StarFilledIconProps {
  size?: string;
  leftColor?: string;
  rightColor?: string;
  leftOpacity?: string;
  rightOpacity?: string;
  onClick?: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  style?: React.CSSProperties;
}

const StarFilledIcon = ({
  size = "20",
  leftColor = "#000000",
  rightColor = "#000000",
  leftOpacity = "1",
  rightOpacity = "1",
  onClick,
  style,
}: StarFilledIconProps) => {
  const gradientId = `gradient-${Math.random().toString(16).slice(2)}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      onClick={onClick}
      style={style}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="50%" stopColor={leftColor} stopOpacity={leftOpacity} />
          <stop offset="50%" stopColor={rightColor} stopOpacity={rightOpacity} />
        </linearGradient>
      </defs>
      <path
        d="M10.0003 14.8085L15.1503 17.9168L13.7837 12.0585L18.3337 8.11683L12.342 7.6085L10.0003 2.0835L7.65866 7.6085L1.66699 8.11683L6.21699 12.0585L4.85033 17.9168L10.0003 14.8085Z"
        fill={`url(#${gradientId})`}
      />
    </svg>
  );
};

export default StarFilledIcon;
