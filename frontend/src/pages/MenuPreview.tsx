import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PublicMenu from './PublicMenu';
import { useStore } from '@/store/useStore';
import { Smartphone, Tablet, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MenuPreview() {
  const { restaurant, categories, menuItems } = useStore();
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');

  const deviceConfig = {
    mobile: { width: 'max-w-[400px]', icon: <Smartphone className="w-4 h-4" />, label: 'Mobile' },
    tablet: { width: 'max-w-[700px]', icon: <Tablet className="w-4 h-4" />, label: 'Tablet' },
    desktop: { width: 'max-w-full', icon: <Monitor className="w-4 h-4" />, label: 'Desktop' }
  };

  return (
    <DashboardLayout>
      <div className="space-y-10 animate-fade-in pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight">Menu Preview</h1>
            <p className="text-muted-foreground text-base mt-2">See how customers view your menu across devices</p>
          </div>

          <div className="flex items-center bg-muted/50 p-1 rounded-xl border border-border w-fit">
            {(['mobile', 'tablet', 'desktop'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDevice(d)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  device === d 
                    ? 'bg-white shadow-sm text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {deviceConfig[d].icon}
                <span className="hidden sm:inline">{deviceConfig[d].label}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className={`mx-auto border border-border rounded-[2.5rem] overflow-hidden shadow-2xl bg-background transition-all duration-500 ease-in-out ${deviceConfig[device].width}`}
        >
          <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-white/5">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="px-3 py-1 rounded-full bg-white/10 text-[10px] text-white/60 font-medium tracking-wider">
               PREVIEW MODE: {device.toUpperCase()}
            </div>
            <div className="w-10" /> {/* Spacer */}
          </div>
          <div className="h-[750px] overflow-y-auto no-scrollbar relative">
            {restaurant && (
              <PublicMenu previewData={{ restaurant, categories, menuItems }} />
            )}
            {!restaurant && (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                <p>Loading your menu preview...</p>
              </div>
            )}
          </div>
          {/* Virtual Home Bar for Mobile/Tablet */}
          {device !== 'desktop' && (
             <div className="h-6 bg-background flex flex-col items-center justify-center">
                <div className="w-24 h-1.5 bg-muted rounded-full" />
             </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
