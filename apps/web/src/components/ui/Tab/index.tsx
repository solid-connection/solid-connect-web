type TabProps<T extends string> = {
  choices: readonly T[];
  choice: T;
  setChoice: (choice: T) => void;
  color?: {
    activeBtn?: string;
    deactiveBtn?: string;
    activeBtnFont?: string;
    deactiveBtnFont?: string;
  };
};

const Tab = <const T extends string>({ choices, choice, setChoice, color }: TabProps<T>) => {
  const defaultColor = {
    activeBtnFont: "text-black",
    deactiveBtnFont: "text-gray-200",
  };
  const combinedColor = {
    activeBtnFont: color?.activeBtnFont ? `text-[${color.activeBtnFont}]` : defaultColor.activeBtnFont,
    deactiveBtnFont: color?.deactiveBtnFont ? `text-[${color.deactiveBtnFont}]` : defaultColor.deactiveBtnFont,
  };

  return (
    <div className="flex h-9 w-full cursor-pointer flex-row typo-medium-2">
      {choices.map((c) => (
        <button
          key={c}
          className={`flex w-full items-center justify-center bg-white ${choice === c ? "border-b-2 border-primary" : ""} ${choice === c ? combinedColor.activeBtnFont : combinedColor.deactiveBtnFont}`}
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
