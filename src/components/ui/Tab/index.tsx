type TabProps = {
  choices: string[];
  choice: string;
  setChoice: React.Dispatch<React.SetStateAction<string>>;
  color?: {
    activeBtn?: string;
    deactiveBtn?: string;
    activeBtnFont?: string;
    deactiveBtnFont?: string;
  };
};

const Tab = ({ choices, choice, setChoice, color }: TabProps) => {
  const defaultColor = {
    activeBtnFont: "#000",
    deactiveBtnFont: "#7D7D7D",
  };
  const combinedColor = { ...defaultColor, ...color };

  return (
    <div className="flex h-9 w-full cursor-pointer flex-row text-sm font-medium">
      {choices.map((c) => (
        <button
          key={c}
          style={{
            color: choice === c ? combinedColor.activeBtnFont : combinedColor.deactiveBtnFont,
          }}
          className={`flex w-full items-center justify-center bg-white ${choice === c ? "border-b-2 border-secondary" : ""} `}
          onClick={() => setChoice(c)}
          type="button"
        >
          <div>{c}</div>
        </button>
      ))}
    </div>
  );
};

export default Tab;
