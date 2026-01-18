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
    className="flex flex-row overflow-x-auto whitespace-nowrap bg-bg-100 font-serif text-black typo-sb-9"
  >
    {choices.map((c) => (
      <button
        key={c}
        className={`flex items-center justify-center border-b-2 px-5 py-3.5 ${
          choice === c ? "border-primary" : "border-secondary-2"
        }`}
        style={choice === c && borderColor ? { borderColor } : {}}
        onClick={() => setChoice(c)}
        type="button"
      >
        <div>{c}</div>
      </button>
    ))}
  </div>
);

export default ScrollTab;
