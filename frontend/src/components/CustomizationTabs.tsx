import React from 'react';

type CustomizationTabsProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

export default function CustomizationTabs({ activeTab, onTabChange }: CustomizationTabsProps) {
  const tabs = ['Visuals', 'Typography', 'Layout'];

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 bg-slate-200/50 p-1 rounded-xl w-full sm:w-fit border border-slate-200/60">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-all flex-1 sm:flex-none ${
              activeTab === tab
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
