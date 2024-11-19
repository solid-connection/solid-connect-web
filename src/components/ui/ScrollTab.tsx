type ScrollTabProps = {
  choices: string[];
  choice: string;
  setChoice: React.Dispatch<React.SetStateAction<string>>;
  borderColor?: string;
  style?: React.CSSProperties;
};

const ScrollTab = ({ choices, choice, setChoice, borderColor, style }: ScrollTabProps) => (
  <div
    style={style}
    className="flex flex-row overflow-x-auto whitespace-nowrap bg-[#f9f9f9] font-serif text-sm font-semibold text-black"
  >
    {choices.map((c) => (
      <button
        key={c}
        className="flex items-center justify-center border-b-2 border-secondary-2 px-5 py-3.5"
        style={choice === c ? { borderColor: borderColor || "var(--primary-1, #6f90d1)" } : {}}
        onClick={() => setChoice(c)}
        type="button"
      >
        <div>{c}</div>
      </button>
    ))}
  </div>
);

export default ScrollTab;
