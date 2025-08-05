import useFloatingUpHandler from "./hooks/useFloatingUpHandler";

interface FloatingUpBtnProps {
  scrollYThreshold?: number;
}

const FloatingUpBtn = ({ scrollYThreshold = 300 }: FloatingUpBtnProps) => {
  const { isVisible, handleClick } = useFloatingUpHandler(scrollYThreshold);
  if (!isVisible) return null;
  return (
    <button
      className="fixed bottom-20 left-1/2 z-50 h-10 w-10 -translate-x-1/2 transform rounded-full bg-primary-100 p-3 text-primary shadow-lg"
      onClick={handleClick}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
};
export default FloatingUpBtn;
