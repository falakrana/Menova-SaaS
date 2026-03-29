import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Type, Layout } from 'lucide-react';

type CustomizationTabsProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

const tabData = [
  { id: 'Visuals', icon: Palette, label: 'Visuals' },
  { id: 'Typography', icon: Type, label: 'Typography' },
  { id: 'Layout', icon: Layout, label: 'Layout' }
];

export default function CustomizationTabs({ activeTab, onTabChange }: CustomizationTabsProps) {
  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/80 backdrop-blur-md rounded-[1.25rem] w-full sm:w-fit border border-slate-200/50 shadow-inner">
        {tabData.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`group relative flex items-center gap-2.5 px-6 py-2.5 rounded-[0.85rem] text-xs font-black uppercase tracking-widest transition-all duration-300 flex-1 sm:flex-none ${
              activeTab === tab.id
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeAdminTab"
                className="absolute inset-0 bg-slate-900 rounded-[0.85rem] shadow-xl shadow-slate-900/10"
              />
            )}
            <tab.icon className={`relative z-10 w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${activeTab === tab.id ? 'text-primary' : ''}`} />
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
