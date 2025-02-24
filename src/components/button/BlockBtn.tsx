import React from "react";

export interface BlockBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
  children: React.ReactNode;
}

const BlockBtn = React.forwardRef<HTMLButtonElement, BlockBtnProps>(({ onClick, children, ...props }, ref) => (
  <button
    ref={ref}
    className="h-[3.125rem] w-full min-w-80 max-w-screen-sm rounded-lg bg-primary disabled:opacity-50"
    onClick={onClick}
    type="button"
    {...props}
  >
    <span className="font-serif text-base font-medium text-white">{children}</span>
  </button>
));
BlockBtn.displayName = "BlockBtn";

export default BlockBtn;
