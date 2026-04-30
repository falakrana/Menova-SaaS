import React from 'react';
import { Smartphone, Tablet, Monitor } from 'lucide-react';
import PublicMenu from '@/pages/PublicMenu';

type LivePreviewProps = {
  restaurantName: string;
  primaryColor: string;
  accentColor: string;
  logoUrl?: string;
  headingFont: string;
  bodyFont: string;
  layout: string;
  templateId: string;
  
  // Advanced Typography settings
  tagline: string;
  menuTextSize: string;
  currency: string;
  priceFormat: string;
  menuAlignment: string;
  showDescriptions: boolean;
};

export default function LivePreview({ 
  restaurantName, 
  primaryColor,
  accentColor,
  logoUrl,
  headingFont,
  bodyFont,
  layout,
  templateId,
  tagline,
  menuTextSize,
  currency,
  priceFormat,
  menuAlignment,
  showDescriptions
}: LivePreviewProps) {
  const [device, setDevice] = React.useState<'mobile'|'tablet'>('mobile');

  // Device width mapping
  const deviceWidth = {
    mobile: 'max-w-[360px]',
    tablet: 'max-w-[540px]'
  }[device];

  // Dummy data for preview
  const dummyRestaurant = {
    name: restaurantName || 'Golden Fork',
    themeColor: primaryColor,
    accentColor: accentColor,
    logoUrl: logoUrl,
    fontStyle: headingFont,
    bodyFont: bodyFont,
    layout: layout,
    templateId: templateId,
    tagline: tagline,
    menuTextSize: menuTextSize,
    currency: currency,
    priceFormat: priceFormat,
    menuAlignment: menuAlignment,
    showDescriptions: showDescriptions,
    location: '123 Preview St'
  };

  const dummyCategories = [
    { id: 'c1', name: 'Starters' },
    { id: 'c2', name: 'Main Course' },
  ];

  const dummyMenuItems = [
    {
      id: 'm1',
      name: 'Tomato Bruschetta',
      description: 'Toasted artisan bread topped with ripe tomatoes, garlic, and fresh basil leaves.',
      price: 12,
      categoryId: 'c1',
      available: true,
      likesCount: 5,
      image: 'https://images.unsplash.com/photo-1572695157366-5e585e5055b8?auto=format&fit=crop&q=80&w=200&h=200',
      isVeg: true
    },
    {
      id: 'm2',
      name: 'Chef\'s Special Filet',
      description: 'Prime cut tenderloin with peppercorn reduction, asparagus, and truffle mash.',
      price: 28,
      categoryId: 'c2',
      available: true,
      likesCount: 12,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=200&h=200'
    }
  ];

  const previewData = {
    restaurant: dummyRestaurant,
    categories: dummyCategories,
    menuItems: dummyMenuItems
  };

  return (
    <div className="flex flex-col items-center w-full mx-auto h-fit">
      
      {/* Device Toggles */}
      <div className="flex bg-slate-200/50 p-1 mb-6 rounded-lg gap-1 border border-slate-200 shadow-sm">
        <button onClick={() => setDevice('mobile')} className={`p-2 rounded-md transition-colors ${device === 'mobile' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`} title="Mobile">
          <Smartphone size={18} />
        </button>
        <button onClick={() => setDevice('tablet')} className={`p-2 rounded-md transition-colors ${device === 'tablet' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`} title="Tablet">
          <Tablet size={18} />
        </button>

      </div>
      
      {/* Device Container */}
      <div className={`bg-white shadow-2xl overflow-hidden border-8 border-slate-900 relative h-[680px] w-full ${deviceWidth} transition-all duration-500 ease-in-out flex flex-col mx-auto ${device === 'mobile' ? 'rounded-[2.5rem]' : 'rounded-2xl'}`}>
        
        {/* Notch - only on mobile */}
        {device === 'mobile' && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20 shadow-sm" />
        )}
        
        {/* Render actual template using PublicMenu component */}
        <div className="h-full w-full overflow-y-auto no-scrollbar relative">
          <PublicMenu previewData={previewData} embedded={true} embeddedDevice={device} />
        </div>
      </div>

      {/* Analytics Insight */}
      <div className="mt-8 bg-blue-50 border border-blue-100 text-blue-800 p-4 w-full rounded-xl shadow-sm max-w-[360px] mx-auto text-center flex flex-col items-center gap-2">
        <div className="p-2 bg-blue-100 rounded-full text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
        </div>
        <div>
          <h5 className="text-sm font-bold">Marketing Insight</h5>
          <p className="text-xs text-blue-600/80 mt-0.5 font-medium leading-relaxed">Menus with high-quality templates receive 45% more engagement on average.</p>
        </div>
      </div>
    </div>
  );
}
