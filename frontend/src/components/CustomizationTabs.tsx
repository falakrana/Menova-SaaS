import React from 'react';

type CustomizationTabsProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

export default function CustomizationTabs({ activeTab, onTabChange }: CustomizationTabsProps) {
  const tabs = ['Visuals', 'Typography', 'Layout'];

  return (
    <div className="flex gap-2 mb-8 bg-slate-200/50 p-1 rounded-xl w-fit">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === tab
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
