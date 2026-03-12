type ScoreSearchFieldProps = {
  keyWords: string[];
  setKeyWord: (_keyWord: string) => void;
};

const ScoreSearchField = ({ keyWords, setKeyWord }: ScoreSearchFieldProps) => (
  <div>
    <div className="px-5 text-k-800 typo-sb-7">인기 검색</div>
    <div className="mt-2 flex flex-wrap gap-2 px-5">
      {keyWords.map((keyWord) => (
        <button
          key={keyWord}
          className="flex items-center justify-center gap-[10px] rounded-full bg-k-50 px-3 py-[5px] text-k-800 transition-colors hover:bg-k-100 typo-medium-2"
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
