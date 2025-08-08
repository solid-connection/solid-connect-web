import useFloatingUpHandler from "./hooks/useFloatingUpHandler";

interface FloatingUpBtnProps {
  scrollYThreshold?: number;
}

const FloatingUpBtn = ({ scrollYThreshold }: FloatingUpBtnProps) => {
  const { isVisible, handleClick } = useFloatingUpHandler(scrollYThreshold);
  if (!isVisible) return null;
  return (
    <button
      className="fixed bottom-20 left-1/2 flex h-10 w-10 -translate-x-1/2 transform items-center justify-center rounded-full bg-primary-100 p-0 text-primary shadow-lg"
      onClick={handleClick}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
};
export default FloatingUpBtn;
