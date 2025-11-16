type ScoreSearchFieldProps = {
  keyWords: string[];
  setKeyWord: (_keyWord: string) => void;
};

const ScoreSearchField = ({ keyWords, setKeyWord }: ScoreSearchFieldProps) => (
  <div>
    <div className="ml-5 mt-[18px] text-base font-semibold text-black">인기 검색</div>
    <div className="ml-5 mt-2.5 flex flex-wrap gap-2">
      {keyWords.map((keyWord) => (
        <button
          key={keyWord}
          className="flex items-center justify-center gap-2.5 rounded-full bg-[#fafafa] px-3 py-[5px] text-sm font-medium leading-[160%] text-black"
          onClick={() => setKeyWord(keyWord)}
          type="button"
        >
          {keyWord}
        </button>
      ))}
    </div>
  </div>
);

export default ScoreSearchField;
