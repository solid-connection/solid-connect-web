import clsx from "clsx";

type ToolTipMessageProps = {
  message: string;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
};

const ToolTipMessage = ({
  message,
  bgColor = "primary",
  borderColor = "primary",
  textColor = "k-0",
}: ToolTipMessageProps) => {
  return (
    <div className="relative h-full w-full">
      <div
        className={clsx(
          "absolute -top-2 left-1/2 h-0 w-0 -translate-x-1/2",
          "border-b-8 border-l-8 border-r-8",
          borderColor === "secondary" ? "border-b-secondary" : `border-b-${borderColor}`,
          "border-l-transparent border-r-transparent",
        )}
      ></div>
      <div
        className={clsx(
          "whitespace-pre-line break-words rounded-lg px-4 py-3 text-center typo-regular-2",
          bgColor === "secondary" ? "bg-secondary" : `bg-${bgColor}`,
          textColor === "white" ? "text-white" : `text-${textColor}`,
        )}
      >
        {message}
      </div>
    </div>
  );
};

export default ToolTipMessage;
