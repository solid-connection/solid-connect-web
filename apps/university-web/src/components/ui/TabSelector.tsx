export interface TabSelectorProps {
  tabs: string[];
  selectedTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

const TabSelector = ({ tabs, selectedTab, onTabChange, className = "" }: TabSelectorProps) => {
  return (
    <div role="tablist" aria-label="탭 선택기" className={`flex border-b border-gray-200 ${className}`}>
      {tabs.map((tab, idx) => {
        const isSelected = selectedTab === tab;
        const tabId = `tab-${idx}`;
        const panelId = `panel-${idx}`;
        return (
          <button
            key={tab}
            id={tabId}
            role="tab"
            aria-selected={isSelected}
            aria-controls={panelId}
            tabIndex={isSelected ? 0 : -1}
            type="button"
            onClick={() => onTabChange(tab)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") onTabChange(tabs[(idx + 1) % tabs.length]);
              if (e.key === "ArrowLeft") onTabChange(tabs[(idx - 1 + tabs.length) % tabs.length]);
            }}
            className={`flex-1 py-4 text-center outline-offset-2 typo-medium-1 ${
              isSelected ? "border-b-2 border-primary text-primary" : "text-k-500"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};

export default TabSelector;
