import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Check } from 'lucide-react';

type LayoutCardProps = {
  selectedLayout: string;
  onLayoutChange: (val: string) => void;
  primaryColor: string;
};

const LAYOUTS = [
  { id: 'classic', label: 'Classic List', desc: 'Standard top-to-bottom list with small thumbnails.', icon: <><span className="block w-full h-1 bg-slate-300 rounded-sm mb-1"/><span className="block w-full h-1 bg-slate-300 rounded-sm mb-1"/><span className="block w-2/3 h-1 bg-slate-300 rounded-sm"/></> },
  { id: 'grid', label: 'Card Grid', desc: '2-column grid layout for visually heavy menus.', icon: <div className="grid grid-cols-2 gap-1 h-full"><div className="bg-slate-300 rounded-sm h-full w-full"/><div className="bg-slate-300 rounded-sm h-full w-full"/></div> },
  { id: 'minimal', label: 'Minimal Menu', desc: 'Text-focused with no images for a clean look.', icon: <><span className="block w-full h-0.5 bg-slate-200 mb-2"/><span className="block w-3/4 h-1 bg-slate-400 rounded-sm mb-1"/><span className="block w-1/2 h-1 bg-slate-300 rounded-sm mb-2"/><span className="block w-full h-0.5 bg-slate-200"/></> },
  { id: 'premium', label: 'Premium Menu', desc: 'Large edge-to-edge images and elegant spacing.', icon: <><span className="block w-full h-4 bg-slate-300 rounded-sm mb-1"/><span className="block w-1/2 h-1 bg-slate-500 rounded-sm mb-1"/></> },
];

export default function LayoutCard({ selectedLayout, onLayoutChange, primaryColor }: LayoutCardProps) {
  return (
    <Card className="rounded-xl shadow-sm border-slate-200">
      <CardHeader className="border-b border-slate-100 pb-4">
        <CardTitle className="text-lg font-semibold text-slate-900">Menu Layout</CardTitle>
        <CardDescription className="text-sm">
          Choose how items are displayed to your customers.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LAYOUTS.map((layout) => {
            const isSelected = selectedLayout === layout.id;
            return (
              <div 
                key={layout.id}
                onClick={() => onLayoutChange(layout.id)}
                className={`flex flex-col border rounded-xl p-4 cursor-pointer transition-all duration-200
                  ${isSelected ? 'border-2 shadow-sm bg-slate-50/50' : 'border-slate-200 hover:border-slate-300 bg-white'}
                `}
                style={isSelected ? { borderColor: primaryColor } : {}}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-md bg-slate-100 border border-slate-200 p-2 flex flex-col justify-center">
                    {layout.icon}
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: primaryColor }}>
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </div>
                <h4 className="font-semibold text-slate-900 text-sm">{layout.label}</h4>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">{layout.desc}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
