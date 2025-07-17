type ToolTipMessageProps = {
  message: string;
  bgColor?: string;
  textColor?: string;
};

const ToolTipMessage = ({ message, bgColor = "primary", textColor = "k-0" }: ToolTipMessageProps) => {
  return (
    <div className="relative h-full w-full">
      <div
        className={`absolute -top-2 left-1/2 h-0 w-0 -translate-x-1/2 border-b-8 border-l-8 border-r-8 border-b-${bgColor} border-l-transparent border-r-transparent`}
      ></div>
      <div className={`whitespace-pre-line rounded-lg bg-${bgColor} px-4 py-3 text-center text-sm text-${textColor}`}>
        {message}
      </div>
    </div>
  );
};

export default ToolTipMessage;
