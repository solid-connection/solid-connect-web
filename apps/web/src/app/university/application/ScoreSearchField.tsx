type ScoreSearchFieldProps = {
  keyWords: string[];
  setKeyWord: (_keyWord: string) => void;
};

const ScoreSearchField = ({ keyWords, setKeyWord }: ScoreSearchFieldProps) => (
  <div>
    <div className="ml-5 mt-[18px] text-black typo-sb-7">인기 검색</div>
    <div className="ml-5 mt-[10px] flex flex-wrap gap-2">
      {keyWords.map((keyWord) => (
        <button
          key={keyWord}
          className="flex items-center justify-center gap-[10px] rounded-full bg-bg-50 px-3 py-[5px] text-black typo-medium-2"
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
