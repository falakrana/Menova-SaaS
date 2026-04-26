import React from 'react';
import { TEMPLATES } from '@/templates/TemplateEngine';

type TemplateCardProps = {
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
  primaryColor: string;
};

const getTemplateIcon = (id: string) => {
  switch (id) {
    case 'standard': return <><span className="block w-full h-1 bg-slate-300 rounded-sm mb-1"/><span className="block w-full h-1 bg-slate-300 rounded-sm mb-1"/><span className="block w-2/3 h-1 bg-slate-300 rounded-sm"/></>;
    case 'premium-dark': return <div className="h-full w-full bg-slate-800 rounded flex flex-col items-center p-1"><div className="w-full h-2 bg-slate-600 rounded-sm mb-1"/><div className="w-4 h-4 bg-slate-700 rounded-full"/></div>;
    case 'warm-rustic': return <div className="h-full w-full bg-[#EFE9E0] rounded flex flex-col items-center justify-center p-1 border border-[#D47530]/20"><div className="w-6 h-6 rounded-full border-2 border-white bg-[#D47530]/30"/></div>;
    case 'clean-catering': return <div className="h-full w-full bg-white rounded flex flex-col p-1 gap-1"><div className="w-full h-2 bg-emerald-100 rounded-sm"/><div className="grid grid-cols-2 gap-1 h-full"><div className="bg-emerald-50 rounded-sm"/><div className="bg-emerald-50 rounded-sm"/></div></div>;
    default: return <div className="text-[10px] text-slate-400 font-medium">Template</div>;
  }
};

export default function TemplateCard({ selectedTemplate, onTemplateChange, primaryColor }: TemplateCardProps) {
  return (
    <div className="space-y-4">
      {TEMPLATES.map((template) => (
        <button
          key={template.id}
          onClick={() => onTemplateChange(template.id)}
          className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 ${
            selectedTemplate === template.id
              ? 'bg-white border-primary shadow-lg shadow-primary/10 ring-1 ring-primary/20'
              : 'bg-slate-50 border-transparent hover:border-slate-200'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-slate-200 shrink-0 p-2 overflow-hidden flex flex-col justify-center">
            {getTemplateIcon(template.id)}
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate-900 leading-tight mb-1">{template.label}</p>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">{template.desc}</p>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
            selectedTemplate === template.id ? 'border-primary bg-primary' : 'border-slate-300'
          }`}>
            {selectedTemplate === template.id && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
        </button>
      ))}
    </div>
  );
}
