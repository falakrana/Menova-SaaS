import React from 'react';
import { ChevronDown, Palette, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const THEME_PRESETS = [
  { id: 'classic', name: 'Classic Restaurant', primary: '#ef4444', accent: '#0f172a' },
  { id: 'dark', name: 'Modern Dark', primary: '#1e293b', accent: '#3b82f6' },
  { id: 'cafe', name: 'Cafe Style', primary: '#92400e', accent: '#fef3c7' },
  { id: 'luxury', name: 'Luxury Dining', primary: '#111827', accent: '#d4af37' },
  { id: 'green', name: 'Fresh Green', primary: '#10b981', accent: '#064e3b' },
  { id: 'blue', name: 'Ocean Blue', primary: '#0ea5e9', accent: '#1e3a8a' },
  { id: 'white', name: 'Minimal White', primary: '#f8fafc', accent: '#334155' },
];

const PRIMARY_PRESETS = [
  { name: 'Tomato Red', color: '#ef4444' },
  { name: 'Sunset Orange', color: '#f97316' },
  { name: 'Cafe Brown', color: '#92400e' },
  { name: 'Olive Green', color: '#65a30d' },
  { name: 'Ocean Blue', color: '#0ea5e9' },
  { name: 'Royal Purple', color: '#8b5cf6' },
  { name: 'Charcoal Black', color: '#1e293b' },
  { name: 'Golden Yellow', color: '#eab308' },
];

const ACCENT_PRESETS = [
  { name: 'Navy', color: '#1e3a8a' },
  { name: 'Charcoal', color: '#334155' },
  { name: 'Soft Gray', color: '#94a3b8' },
  { name: 'Deep Green', color: '#064e3b' },
  { name: 'Burgundy', color: '#7f1d1d' },
];

type PaletteCardProps = {
  selectedColor: string;
  onSelectColor: (color: string) => void;
  accentColor: string;
  onSelectAccentColor: (color: string) => void;
};

export default function PaletteCard({ 
  selectedColor, 
  onSelectColor, 
  accentColor, 
  onSelectAccentColor 
}: PaletteCardProps) {
  
  const handlePresetChange = (presetId: string) => {
    const preset = THEME_PRESETS.find(p => p.id === presetId);
    if (preset) {
      onSelectColor(preset.primary);
      onSelectAccentColor(preset.accent);
    }
  };

  const ColorChip = ({ 
    name, 
    color, 
    isSelected, 
    onClick 
  }: { 
    name: string, 
    color: string, 
    isSelected: boolean, 
    onClick: () => void 
  }) => (
    <button
      onClick={onClick}
      className={`group flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
        isSelected 
          ? 'border-primary bg-primary/5 shadow-sm' 
          : 'border-slate-100 bg-white hover:border-slate-200'
      }`}
    >
      <div 
        className="w-4 h-4 rounded-full border border-black/10 shadow-inner" 
        style={{ backgroundColor: color }} 
      />
      <span className={`text-xs font-medium ${isSelected ? 'text-primary' : 'text-slate-600'}`}>
        {name}
      </span>
    </button>
  );

  const CustomPicker = ({ 
    label, 
    value, 
    onChange 
  }: { 
    label: string, 
    value: string, 
    onChange: (val: string) => void 
  }) => (
    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 mt-4">
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-slate-700">{label}</span>
        <span className="text-[10px] font-mono text-slate-400 uppercase">{value}</span>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-2 bg-white text-xs border-slate-200">
            <div className="w-3 h-3 rounded shadow-inner" style={{ backgroundColor: value }} />
            Pick Color
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="end">
          <input 
            type="color" 
            value={value.length === 7 ? value : '#000000'} 
            onChange={(e) => onChange(e.target.value)}
            className="w-40 h-40 cursor-pointer rounded-lg border border-slate-200 p-0"
          />
        </PopoverContent>
      </Popover>
    </div>
  );

  return (
    <Card className="rounded-xl shadow-sm border-slate-200">
      <CardHeader className="border-b border-slate-100 pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Palette className="h-5 w-5 text-slate-500" />
              Palette Settings
            </CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Customize your restaurant’s brand colors.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-8">
        {/* Step 1: Theme Presets */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            1. Theme Preset
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info size={14} className="text-slate-300" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Quickly apply a professionally designed color scheme.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <Select onValueChange={handlePresetChange}>
            <SelectTrigger className="w-full bg-slate-50 border-slate-200 h-11 shadow-sm transition-all hover:bg-slate-100/50">
              <SelectValue placeholder="Classic Restaurant" />
            </SelectTrigger>
            <SelectContent>
              {THEME_PRESETS.map((p) => (
                <SelectItem key={p.id} value={p.id} className="cursor-pointer">
                  <div className="flex items-center gap-3 py-1">
                    <div className="flex -space-x-1.5">
                      <div className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: p.primary }} />
                      <div className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: p.accent }} />
                    </div>
                    <span className="font-medium text-slate-700">{p.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Step 2: Primary Color */}
        <div className="space-y-3">
          <div className="flex flex-col gap-0.5">
            <label className="text-sm font-semibold text-slate-800">2. Primary Brand Color</label>
            <p className="text-xs text-slate-500">This color appears in the header and main branding.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRIMARY_PRESETS.map((p) => (
              <ColorChip 
                key={p.name} 
                name={p.name} 
                color={p.color} 
                isSelected={selectedColor === p.color}
                onClick={() => onSelectColor(p.color)}
              />
            ))}
          </div>
          <CustomPicker label="Custom Brand Color" value={selectedColor} onChange={onSelectColor} />
        </div>

        {/* Step 3: Accent Color */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col gap-0.5">
            <label className="text-sm font-semibold text-slate-800">3. Accent Highlight Color</label>
            <p className="text-xs text-slate-500">This color highlights buttons and active menu categories.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {ACCENT_PRESETS.map((p) => (
              <ColorChip 
                key={p.name} 
                name={p.name} 
                color={p.color} 
                isSelected={accentColor === p.color}
                onClick={() => onSelectAccentColor(p.color)}
              />
            ))}
          </div>
          <CustomPicker label="Custom Accent Color" value={accentColor} onChange={onSelectAccentColor} />
        </div>
      </CardContent>
    </Card>
  );
}
