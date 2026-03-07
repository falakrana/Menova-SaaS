import React, { useRef } from 'react';
import { Upload, Image as ImageIcon, Trash2, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type BrandingCardProps = {
  logoUrl?: string;
  onLogoUpload: (file: File) => void;
  onRemoveLogo: () => void;
};

export default function BrandingCard({ logoUrl, onLogoUpload, onRemoveLogo }: BrandingCardProps) {
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onLogoUpload(e.target.files[0]);
    }
  };

  return (
    <Card className="rounded-xl shadow-sm border-slate-200 overflow-hidden">
      <CardHeader className="border-b border-slate-100 pb-4">
        <CardTitle className="text-lg font-semibold text-slate-900">Imagery & Branding</CardTitle>
        <CardDescription className="text-sm text-slate-500">
          Upload your restaurant logo to build brand recognition
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Left Side: Logo Preview */}
          <div className="relative group">
            <div className="w-[120px] h-[120px] rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/50 group-hover:bg-slate-100/50">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt="Logo Preview" 
                  className="w-full h-full object-contain p-2" 
                />
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-slate-400">
                  <ImageIcon size={32} strokeWidth={1.5} />
                  <span className="text-[10px] font-medium uppercase tracking-wider text-center px-2">No logo uploaded</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Actions */}
          <div className="flex-1 space-y-4 w-full text-center md:text-left">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-slate-800">Restaurant Logo</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                PNG or SVG recommended · Max 5MB · Square ratio.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <input 
                type="file" 
                ref={logoInputRef} 
                onChange={handleLogoChange} 
                accept="image/png, image/jpeg, image/svg+xml" 
                className="hidden" 
              />
              <Button 
                variant="default" 
                className="bg-primary hover:bg-primary/90 text-white shadow-sm flex items-center gap-2"
                onClick={() => logoInputRef.current?.click()}
              >
                <Upload size={16} />
                {logoUrl ? 'Change Logo' : 'Upload Logo'}
              </Button>
              
              {logoUrl && (
                <Button 
                  variant="outline" 
                  className="border-slate-200 text-slate-600 hover:text-destructive hover:bg-destructive/5 hover:border-destructive/20 flex items-center gap-2 transition-all"
                  onClick={onRemoveLogo}
                >
                  <Trash2 size={16} />
                  Remove Logo
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
