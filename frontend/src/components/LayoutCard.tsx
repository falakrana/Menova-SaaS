import React from 'react';

type LayoutCardProps = {
  selectedLayout: string;
  onLayoutChange: (layout: string) => void;
  primaryColor: string;
};

const LAYOUTS = [
  { id: 'classic', label: 'Classic List', desc: 'Standard top-to-bottom list with small thumbnails.', icon: <><span className="block w-full h-1 bg-slate-300 rounded-sm mb-1"/><span className="block w-full h-1 bg-slate-300 rounded-sm mb-1"/><span className="block w-2/3 h-1 bg-slate-300 rounded-sm"/></> },
  { id: 'grid', label: 'Card Grid', desc: '2-column grid layout for visually heavy menus.', icon: <div className="grid grid-cols-2 gap-1 h-full"><div className="bg-slate-300 rounded-sm h-full w-full"/><div className="bg-slate-300 rounded-sm h-full w-full"/></div> },
  { id: 'minimal', label: 'Minimal Menu', desc: 'Text-focused with no images for a clean look.', icon: <><span className="block w-full h-0.5 bg-slate-200 mb-2"/><span className="block w-3/4 h-1 bg-slate-400 rounded-sm mb-1"/><span className="block w-1/2 h-1 bg-slate-300 rounded-sm mb-2"/><span className="block w-full h-0.5 bg-slate-200"/></> },
];

export default function LayoutCard({ selectedLayout, onLayoutChange, primaryColor }: LayoutCardProps) {
  return (
    <div className="space-y-4">
      {LAYOUTS.map((layout) => (
        <button
          key={layout.id}
          onClick={() => onLayoutChange(layout.id)}
          className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 ${
            selectedLayout === layout.id
              ? 'bg-white border-primary shadow-lg shadow-primary/10 ring-1 ring-primary/20'
              : 'bg-slate-50 border-transparent hover:border-slate-200'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-slate-200 shrink-0 p-2 overflow-hidden flex flex-col justify-center">
            {layout.icon}
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate-900 leading-tight mb-1">{layout.label}</p>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">{layout.desc}</p>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
            selectedLayout === layout.id ? 'border-primary bg-primary' : 'border-slate-300'
          }`}>
            {selectedLayout === layout.id && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
        </button>
      ))}
    </div>
  );
}
