import React from "react";

export interface TabSelectorProps {
  tabs: string[];
  selectedTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

const TabSelector = ({ tabs, selectedTab, onTabChange, className = "" }: TabSelectorProps) => {
  return (
    <div className={`flex border-b border-gray-200 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`flex-1 py-4 text-center text-base font-medium ${
            selectedTab === tab ? "border-b-2 border-primary text-primary" : "text-k-500"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabSelector;
