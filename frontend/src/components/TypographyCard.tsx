import React from 'react';
import { Type, AlignLeft, AlignCenter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

type TypographyCardProps = {
  headingFont: string;
  onHeadingFontChange: (font: string) => void;
  bodyFont: string;
  onBodyFontChange: (font: string) => void;
  
  // New typography options
  tagline: string;
  onTaglineChange: (tagline: string) => void;
  menuTextSize: string;
  onMenuTextSizeChange: (size: string) => void;
  currency: string;
  onCurrencyChange: (currency: string) => void;
  priceFormat: string;
  onPriceFormatChange: (format: string) => void;
  menuAlignment: string;
  onMenuAlignmentChange: (align: string) => void;
  showDescriptions: boolean;
  onShowDescriptionsChange: (show: boolean) => void;
};

const FONTS = [
  { value: 'Inter', label: 'Inter (Clean & Modern)' },
  { value: 'Roboto', label: 'Roboto (Standard)' },
  { value: 'Poppins', label: 'Poppins (Playful)' },
  { value: 'Montserrat', label: 'Montserrat (Elegant)' },
  { value: 'Playfair Display', label: 'Playfair (Classic Serif)' },
  { value: 'Courier New', label: 'Courier (Monospace/Retro)' }
];

const CURRENCIES = [
  { value: 'INR', label: '₹ (INR)' },
  { value: 'USD', label: '$ (USD)' },
  { value: 'EUR', label: '€ (EUR)' },
  { value: 'GBP', label: '£ (GBP)' },
];

const PRICE_FORMATS = [
  { value: 'PREFIX_SPACE', label: '₹ 120' },
  { value: 'SUFFIX_SPACE', label: '120 ₹' },
  { value: 'PREFIX_NOSPACE', label: '₹120' },
  { value: 'JUST_NUMBER', label: '120' },
];

export default function TypographyCard({ 
  headingFont, 
  onHeadingFontChange, 
  bodyFont, 
  onBodyFontChange,
  tagline,
  onTaglineChange,
  menuTextSize,
  onMenuTextSizeChange,
  currency,
  onCurrencyChange,
  priceFormat,
  onPriceFormatChange,
  menuAlignment,
  onMenuAlignmentChange,
  showDescriptions,
  onShowDescriptionsChange
}: TypographyCardProps) {
  return (
    <Card className="rounded-xl shadow-sm border-slate-200">
      <CardHeader className="border-b border-slate-100 pb-4">
        <CardTitle className="text-lg font-semibold text-slate-900">Typography Settings</CardTitle>
        <CardDescription className="text-sm">
          Select the typography for your menu headers and descriptions.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Heading Font</label>
            <Select value={headingFont} onValueChange={onHeadingFontChange}>
              <SelectTrigger className="w-full bg-white transition-colors hover:bg-slate-50 focus:ring-primary shadow-sm h-10">
                <SelectValue placeholder="Select heading font" />
              </SelectTrigger>
              <SelectContent>
                {FONTS.map(font => (
                  <SelectItem key={`heading-${font.value}`} value={font.value} style={{ fontFamily: font.value }}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 mt-2">Used for restaurant name and category titles.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Body Font</label>
            <Select value={bodyFont} onValueChange={onBodyFontChange}>
              <SelectTrigger className="w-full bg-white transition-colors hover:bg-slate-50 focus:ring-primary shadow-sm h-10">
                <SelectValue placeholder="Select body font" />
              </SelectTrigger>
              <SelectContent>
                {FONTS.map(font => (
                  <SelectItem key={`body-${font.value}`} value={font.value} style={{ fontFamily: font.value }}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 mt-2">Used for item names, descriptions, and prices.</p>
          </div>
        </div>

        {/* Text Details & Layout section */}
        <div className="pt-6 space-y-6">
          <h3 className="text-sm font-semibold text-slate-900 border-b pb-2 mb-4">Text Formatting & Layout</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Restaurant Tagline</label>
              <input 
                type="text" 
                placeholder="e.g., A taste of home" 
                value={tagline}
                onChange={(e) => onTaglineChange(e.target.value)}
                className="w-full h-10 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm bg-white hover:bg-slate-50 transition-colors"
                maxLength={50}
              />
              <p className="text-xs text-slate-500 mt-2">Optional subtitle under restaurant name.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Menu Text Size</label>
              <Select value={menuTextSize} onValueChange={onMenuTextSizeChange}>
                <SelectTrigger className="w-full bg-white transition-colors hover:bg-slate-50 focus:ring-primary shadow-sm h-10">
                  <SelectValue placeholder="Select text size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="md">Medium</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Currency Symbol</label>
              <Select value={currency} onValueChange={onCurrencyChange}>
                <SelectTrigger className="w-full bg-white transition-colors hover:bg-slate-50 focus:ring-primary shadow-sm h-10">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map(c => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Price Format</label>
              <Select value={priceFormat} onValueChange={onPriceFormatChange}>
                <SelectTrigger className="w-full bg-white transition-colors hover:bg-slate-50 focus:ring-primary shadow-sm h-10">
                  <SelectValue placeholder="Select price format" />
                </SelectTrigger>
                <SelectContent>
                  {PRICE_FORMATS.map(f => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 pt-4 border-t border-slate-100 items-start md:items-center justify-between">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">Menu Alignment</label>
              <div className="flex bg-slate-100 rounded-lg p-1 w-fit border border-slate-200">
                <button
                  type="button"
                  onClick={() => onMenuAlignmentChange('left')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${menuAlignment === 'left' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <AlignLeft size={16} /> Left
                </button>
                <button
                  type="button"
                  onClick={() => onMenuAlignmentChange('center')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${menuAlignment === 'center' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <AlignCenter size={16} /> Center
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-6 md:pt-0">
              <Switch id="show-description" checked={showDescriptions} onCheckedChange={onShowDescriptionsChange} />
              <Label htmlFor="show-description" className="text-sm font-medium text-slate-700 cursor-pointer">Show Item Descriptions</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
