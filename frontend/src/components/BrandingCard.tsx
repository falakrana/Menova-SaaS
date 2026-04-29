import React, { useRef } from 'react';
import { Upload, Image as ImageIcon, Trash2, X, Check, ImagePlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type BrandingCardProps = {
  logoUrl?: string | null;
  onLogoUpload: (file: File) => void;
  onRemoveLogo: () => void;
  coverImageUrl?: string | null;
  onCoverUpload: (file: File) => void;
  onRemoveCover: () => void;
};

export default function BrandingCard({ logoUrl, onLogoUpload, onRemoveLogo, coverImageUrl, onCoverUpload, onRemoveCover }: BrandingCardProps) {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onLogoUpload(e.target.files[0]);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onCoverUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Logo Card */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 p-8 lg:p-10 group">
         {/* Background Decor */}
         <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
         
         <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-10">
               {/* Left Side: Logo Preview */}
               <div className="relative group cursor-pointer" onClick={() => logoInputRef.current?.click()}>
                 <div className="w-[160px] h-[160px] rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary group-hover:bg-slate-100/50 shadow-inner group-hover:shadow-2xl group-hover:shadow-primary/5">
                   {logoUrl ? (
                     <img 
                       src={logoUrl} 
                       alt="Logo Preview" 
                       className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" 
                     />
                   ) : (
                     <div className="flex flex-col items-center gap-3 text-slate-300 group-hover:text-primary transition-colors">
                       <ImageIcon size={48} strokeWidth={1} />
                       <span className="text-[10px] font-black uppercase tracking-widest text-center px-4">Upload Brand Logo</span>
                     </div>
                   )}
                 </div>
                 
                 {/* Hover Overlay */}
                 <div className="absolute inset-0 rounded-[2rem] bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-900 translate-y-2 group-hover:translate-y-0 transition-transform">
                       <Upload size={18} />
                    </div>
                 </div>
               </div>

               {/* Right Side: Actions */}
               <div className="flex-1 space-y-6 w-full text-center md:text-left">
                 <div className="space-y-2">
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      <Check size={12} /> Branding Asset
                   </div>
                   <h4 className="text-3xl font-display font-black text-slate-900 tracking-tight leading-none">Identity Logo</h4>
                   <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-sm mx-auto md:mx-0">
                     Your logo is the first thing guests see. We recommend a high-resolution PNG or SVG with a transparent background.
                   </p>
                 </div>

                 <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                   <input 
                     type="file" 
                     ref={logoInputRef} 
                     onChange={handleLogoChange} 
                     accept="image/png, image/jpeg, image/svg+xml" 
                     className="hidden" 
                   />
                   <Button 
                     variant="default" 
                     className="h-14 px-8 rounded-2xl bg-slate-900 border-none hover:bg-slate-800 text-white shadow-xl shadow-slate-900/10 flex items-center gap-3 font-bold transition-all active:scale-95"
                     onClick={() => logoInputRef.current?.click()}
                   >
                     <Upload size={20} />
                     {logoUrl ? 'Change Identity' : 'Upload Logo'}
                   </Button>
                   
                   {logoUrl && (
                     <Button 
                       variant="ghost" 
                       className="h-14 px-8 rounded-2xl border border-red-100 text-red-500 hover:text-red-600 hover:bg-red-50/50 flex items-center gap-3 font-bold transition-all"
                       onClick={onRemoveLogo}
                     >
                       <Trash2 size={20} />
                       Strip Logo
                     </Button>
                   )}
                 </div>
               </div>
            </div>
         </div>
      </div>

      {/* Cover Image Card */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 p-8 lg:p-10 group">
         <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>

         <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-10">
               {/* Left Side: Cover Preview */}
               <div className="relative group/cover cursor-pointer w-full md:w-auto" onClick={() => coverInputRef.current?.click()}>
                 <div className="w-full md:w-[280px] h-[130px] rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden transition-all group-hover/cover:border-primary group-hover/cover:bg-slate-100/50 shadow-inner group-hover/cover:shadow-2xl group-hover/cover:shadow-primary/5">
                   {coverImageUrl ? (
                     <img 
                       src={coverImageUrl} 
                       alt="Cover Preview" 
                       className="w-full h-full object-cover group-hover/cover:scale-105 transition-transform duration-500" 
                     />
                   ) : (
                     <div className="flex flex-col items-center gap-3 text-slate-300 group-hover/cover:text-primary transition-colors">
                       <ImagePlus size={36} strokeWidth={1} />
                       <span className="text-[10px] font-black uppercase tracking-widest text-center px-4">Upload Cover Image</span>
                     </div>
                   )}
                 </div>

                 {/* Hover Overlay */}
                 <div className="absolute inset-0 rounded-[2rem] bg-black/5 opacity-0 group-hover/cover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-900 translate-y-2 group-hover/cover:translate-y-0 transition-transform">
                       <Upload size={18} />
                    </div>
                 </div>
               </div>

               {/* Right Side: Actions */}
               <div className="flex-1 space-y-6 w-full text-center md:text-left">
                 <div className="space-y-2">
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      <Check size={12} /> Hero Visual
                   </div>
                   <h4 className="text-3xl font-display font-black text-slate-900 tracking-tight leading-none">Cover Image</h4>
                   <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-sm mx-auto md:mx-0">
                     This image appears as the hero background on your public menu. If not set, your first food item image is used as a fallback.
                   </p>
                 </div>

                 <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                   <input 
                     type="file" 
                     ref={coverInputRef} 
                     onChange={handleCoverChange} 
                     accept="image/png, image/jpeg, image/webp" 
                     className="hidden" 
                   />
                   <Button 
                     variant="default" 
                     className="h-14 px-8 rounded-2xl bg-slate-900 border-none hover:bg-slate-800 text-white shadow-xl shadow-slate-900/10 flex items-center gap-3 font-bold transition-all active:scale-95"
                     onClick={() => coverInputRef.current?.click()}
                   >
                     <Upload size={20} />
                     {coverImageUrl ? 'Change Cover' : 'Upload Cover'}
                   </Button>
                   
                   {coverImageUrl && (
                     <Button 
                       variant="ghost" 
                       className="h-14 px-8 rounded-2xl border border-red-100 text-red-500 hover:text-red-600 hover:bg-red-50/50 flex items-center gap-3 font-bold transition-all"
                       onClick={onRemoveCover}
                     >
                       <Trash2 size={20} />
                       Remove Cover
                     </Button>
                   )}
                 </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

