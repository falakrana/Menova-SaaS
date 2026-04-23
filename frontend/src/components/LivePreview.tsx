import React from 'react';

import { Smartphone, Tablet, Monitor } from 'lucide-react';

type LivePreviewProps = {
  restaurantName: string;
  primaryColor: string;
  accentColor: string;
  logoUrl?: string;
  headingFont: string;
  bodyFont: string;
  layout: string;
  
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
  tagline,
  menuTextSize,
  currency,
  priceFormat,
  menuAlignment,
  showDescriptions
}: LivePreviewProps) {
  const [device, setDevice] = React.useState<'mobile'|'tablet'|'desktop'>('mobile');
  const [activeCategory, setActiveCategory] = React.useState('Starters');

  // Format Helper for Currency and Padding
  const formatPrice = (price: number) => {
    const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '';
    switch (priceFormat) {
      case 'PREFIX_SPACE': return `${symbol} ${price}`;
      case 'SUFFIX_SPACE': return `${price} ${symbol}`;
      case 'PREFIX_NOSPACE': return `${symbol}${price}`;
      case 'JUST_NUMBER': return `${price}`;
      default: return `${symbol} ${price}`;
    }
  };

  // Helper for translating size props to Tailwind classes
  const getSizeClass = (baseSize: string) => {
    if (menuTextSize === 'sm') return `text-${baseSize === 'xs' ? '[10px]' : baseSize === 'sm' ? 'xs' : baseSize === 'base' ? 'sm' : 'base'}`;
    if (menuTextSize === 'lg') return `text-${baseSize === 'xs' ? 'xs' : baseSize === 'sm' ? 'base' : baseSize === 'base' ? 'lg' : 'xl'}`;
    return `text-${baseSize}`; // Default md
  };

  // Alignment helpers
  const getAlignClass = () => menuAlignment === 'center' ? 'text-center' : 'text-left';
  const getFlexAlignClass = () => menuAlignment === 'center' ? 'items-center text-center' : 'items-start text-left';
  const getPriceAlignClass = () => menuAlignment === 'center' ? 'justify-center w-full mt-2' : 'justify-between items-start';

  // Device width mapping
  const deviceWidth = {
    mobile: 'max-w-[360px]',
    tablet: 'max-w-[540px]',
    desktop: 'max-w-[800px]'
  }[device];

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
        <button onClick={() => setDevice('desktop')} className={`p-2 rounded-md transition-colors ${device === 'desktop' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`} title="Desktop">
          <Monitor size={18} />
        </button>
      </div>
      
      {/* Device Container */}
      <div className={`bg-white shadow-2xl overflow-hidden border-8 border-slate-900 relative h-[680px] w-full ${deviceWidth} transition-all duration-500 ease-in-out flex flex-col mx-auto ${device === 'mobile' ? 'rounded-[2.5rem]' : 'rounded-2xl'}`}>
        
        {/* Notch - only on mobile */}
        {device === 'mobile' && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20 shadow-sm" />
        )}
        
        {/* Preview Header */}
        <div 
          className="h-48 relative flex flex-col items-center justify-end pb-8 text-white transition-colors duration-500 bg-cover bg-center"
          style={{ backgroundColor: primaryColor }}
        >
          {/* Subtle Pattern Overlay */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
          
          <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-900 font-bold text-2xl relative z-10 mb-3 border-2 border-white/20 overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt={restaurantName} className="w-full h-full object-cover" />
            ) : (
              restaurantName.substring(0, 2).toUpperCase()
            )}
          </div>
          <h3 className="font-bold relative z-10 tracking-tight drop-shadow-sm text-xl" style={{ fontFamily: headingFont }}>{restaurantName}</h3>
          
          {tagline && (
            <p className="relative z-10 text-white/90 font-medium mt-1 tracking-wide" style={{ fontFamily: bodyFont, fontSize: '0.9rem' }}>
              {tagline}
            </p>
          )}

          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mt-3 relative z-10 border border-white/10 shadow-sm" style={{ fontFamily: bodyFont }}>
            Table 4
          </div>
        </div>

        {/* Preview Content Area */}
        <div className="flex-1 bg-slate-50 p-4 overflow-y-auto pb-8 scrollbar-hide">
          
          {/* Category Horizontal Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none snap-x" style={{ fontFamily: headingFont }}>
            {['Starters', 'Main Course', 'Desserts', 'Drinks'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 snap-start shadow-sm border ${
                  activeCategory === cat 
                    ? 'text-white shadow-md' 
                    : 'text-slate-600 bg-white border-slate-100 hover:bg-slate-50'
                }`}
                style={activeCategory === cat ? { backgroundColor: accentColor, borderColor: accentColor } : {}}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Items Grid/List depending on selected Layout */}
          <div className={layout === 'grid' ? "grid grid-cols-2 gap-3" : "flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300"}>
            
            {/* Conditional Rendering based on active category */}
            {activeCategory === 'Starters' ? (
              <>
                {layout === 'classic' && (
                  <div className="space-y-4">
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex gap-3 transform transition-all">
                      <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                        <img src="https://images.unsplash.com/photo-1572695157366-5e585e5055b8?auto=format&fit=crop&q=80&w=200&h=200" alt="Bruschetta" className="w-full h-full object-cover" />
                      </div>
                      <div className={`flex flex-col flex-1 ${getFlexAlignClass()}`}>
                        <div className={`flex ${getPriceAlignClass()} w-full mb-1`}>
                          <h4 className={`font-bold text-slate-900 leading-tight ${getSizeClass('sm')}`} style={{ fontFamily: headingFont }}>Tomato Bruschetta</h4>
                          {menuAlignment !== 'center' && <span className={`font-bold shrink-0 transition-colors duration-500 ${getSizeClass('sm')}`} style={{ color: accentColor, fontFamily: bodyFont }}>{formatPrice(12)}</span>}
                        </div>
                        {menuAlignment === 'center' && <span className={`font-bold block mb-1 transition-colors duration-500 ${getSizeClass('sm')}`} style={{ color: accentColor, fontFamily: bodyFont }}>{formatPrice(12)}</span>}
                        
                        {showDescriptions && (
                          <p className={`text-slate-500 leading-relaxed line-clamp-2 ${getSizeClass('xs')} ${getAlignClass()}`} style={{ fontFamily: bodyFont }}>
                            Toasted artisan bread topped with ripe tomatoes, garlic, and fresh basil leaves.
                          </p>
                        )}
                        
                        <button 
                          className="mt-2 text-xs font-semibold px-3 py-2 rounded-xl w-full flex items-center justify-center gap-1 transition-all hover:opacity-90 text-white shadow-sm" 
                          style={{ backgroundColor: accentColor, fontFamily: headingFont }}
                        >
                          Add Item
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {/* ... existing other layouts for Starters ... */}
              </>
            ) : activeCategory === 'Main Course' ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400 bg-white/50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-xs font-medium italic">Simulated Main Course View</p>
                <div className="mt-4 w-full px-4 space-y-4">
                  <div className="h-20 bg-slate-100 rounded-xl animate-pulse" />
                  <div className="h-20 bg-slate-100 rounded-xl animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <p className="text-xs font-medium italic">Category: {activeCategory}</p>
              </div>
            )}

            {layout === 'grid' && (
              <div className={`bg-white p-3.5 rounded-2xl shadow-sm border border-slate-100 flex transition-transform hover:-translate-y-0.5 duration-300 flex-col gap-3`}>
                <div className="w-full h-32 rounded-xl bg-slate-200 object-cover shrink-0 overflow-hidden shadow-inner border border-slate-100/50">
                  <img src="https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Tomato Bruschetta" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-1.5 flex flex-col justify-between py-1">
                  <div>
                    <div className={`flex ${getPriceAlignClass()} w-full mb-1`}>
                      <h4 className={`font-bold text-slate-900 leading-tight pr-2 ${getSizeClass('sm')}`} style={{ fontFamily: headingFont }}>Tomato Bruschetta</h4>
                      {menuAlignment !== 'center' && <span className={`font-bold shrink-0 transition-colors duration-500 ${getSizeClass('sm')}`} style={{ color: accentColor, fontFamily: bodyFont }}>{formatPrice(12)}</span>}
                    </div>
                    {menuAlignment === 'center' && <span className={`font-bold block mb-1 transition-colors duration-500 ${getSizeClass('sm')}`} style={{ color: accentColor, fontFamily: bodyFont }}>{formatPrice(12)}</span>}
                    {showDescriptions && (
                      <p className={`text-slate-500 leading-relaxed line-clamp-2 ${getSizeClass('xs')} ${getAlignClass()}`} style={{ fontFamily: bodyFont }}>
                        Toasted artisan bread topped with ripe tomatoes, garlic, and fresh basil leaves.
                      </p>
                    )}
                  </div>
                  <button 
                    className="mt-2 text-xs font-semibold px-3 py-2 rounded-xl w-full flex items-center justify-center gap-1 transition-all hover:opacity-90 text-white shadow-sm" 
                    style={{ backgroundColor: accentColor, fontFamily: headingFont }}
                  >
                    Add Item
                  </button>
                </div>
              </div>
            )}

            {layout !== 'grid' && layout !== 'classic' && (
              <div className={`bg-white p-3.5 rounded-2xl shadow-sm border border-slate-100 flex transition-transform hover:-translate-y-0.5 duration-300 gap-4`}>
                <div className="flex-1 space-y-1.5 flex flex-col justify-between py-1">
                  <div>
                    <div className={`flex ${getPriceAlignClass()} w-full mb-1`}>
                      <h4 className={`font-bold text-slate-900 leading-tight pr-2 ${getSizeClass('sm')}`} style={{ fontFamily: headingFont }}>Tomato Bruschetta</h4>
                      {menuAlignment !== 'center' && <span className={`font-bold shrink-0 transition-colors duration-500 ${getSizeClass('sm')}`} style={{ color: accentColor, fontFamily: bodyFont }}>{formatPrice(12)}</span>}
                    </div>
                    {menuAlignment === 'center' && <span className={`font-bold block mb-1 transition-colors duration-500 ${getSizeClass('sm')}`} style={{ color: accentColor, fontFamily: bodyFont }}>{formatPrice(12)}</span>}
                    {showDescriptions && (
                      <p className={`text-slate-500 leading-relaxed line-clamp-2 ${getSizeClass('xs')} ${getAlignClass()}`} style={{ fontFamily: bodyFont }}>
                        Toasted artisan bread topped with ripe tomatoes, garlic, and fresh basil leaves.
                      </p>
                    )}
                  </div>
                  <button 
                    className="mt-2 text-xs font-semibold px-3 py-2 rounded-xl w-full flex items-center justify-center gap-1 transition-all hover:opacity-90 text-white shadow-sm" 
                    style={{ backgroundColor: accentColor, fontFamily: headingFont }}
                  >
                    Add Item
                  </button>
                </div>
                <div className={`w-24 h-24 rounded-xl bg-slate-200 object-cover shrink-0 overflow-hidden shadow-inner border border-slate-100/50 `}>
                  <img src="https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Tomato Bruschetta" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {/* Item 2 */}
            {layout === 'classic' && (
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex gap-3">
                <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                  <img src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=200&h=200" alt="Filet" className="w-full h-full object-cover" />
                </div>
                <div className={`flex flex-col flex-1 ${getFlexAlignClass()}`}>
                  <div className={`flex ${getPriceAlignClass()} w-full mb-1`}>
                    <h4 className={`font-bold text-slate-900 leading-tight ${getSizeClass('sm')}`} style={{ fontFamily: headingFont }}>Chef's Special Filet</h4>
                    {menuAlignment !== 'center' && <span className={`font-bold shrink-0 transition-colors duration-500 ${getSizeClass('sm')}`} style={{ color: accentColor, fontFamily: bodyFont }}>{formatPrice(28)}</span>}
                  </div>
                  {menuAlignment === 'center' && <span className={`font-bold block mb-1 transition-colors duration-500 ${getSizeClass('sm')}`} style={{ color: accentColor, fontFamily: bodyFont }}>{formatPrice(28)}</span>}
                  
                  {showDescriptions && (
                    <p className={`text-slate-500 leading-relaxed line-clamp-2 ${getSizeClass('xs')} ${getAlignClass()}`} style={{ fontFamily: bodyFont }}>
                      Prime cut tenderloin with peppercorn reduction, asparagus, and truffle mash.
                    </p>
                  )}
                  <button 
                    className="mt-2 text-xs font-semibold px-3 py-2 rounded-xl w-full flex items-center justify-center gap-1 transition-all hover:opacity-90 text-white shadow-sm" 
                    style={{ backgroundColor: accentColor, fontFamily: headingFont }}
                  >
                    Add Item
                  </button>
                </div>
              </div>
            )}

            {layout === 'grid' && (
              <div className={`bg-white p-3.5 rounded-2xl shadow-sm border border-slate-100 flex transition-transform hover:-translate-y-0.5 duration-300 flex-col gap-3`}>
                <div className="w-full h-32 rounded-xl bg-slate-200 object-cover shrink-0 overflow-hidden shadow-inner border border-slate-100/50">
                  <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Special Filet" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-1.5 flex flex-col justify-between py-1">
                  <div>
                    <div className={`flex ${getPriceAlignClass()} w-full mb-1`}>
                      <h4 className={`font-bold text-slate-900 leading-tight pr-2 ${getSizeClass('sm')}`} style={{ fontFamily: headingFont }}>Chef's Special Filet</h4>
                      {menuAlignment !== 'center' && <span className={`font-bold shrink-0 transition-colors duration-500 ${getSizeClass('sm')}`} style={{ color: accentColor, fontFamily: bodyFont }}>{formatPrice(28)}</span>}
                    </div>
                    {menuAlignment === 'center' && <span className={`font-bold block mb-1 transition-colors duration-500 ${getSizeClass('sm')}`} style={{ color: accentColor, fontFamily: bodyFont }}>{formatPrice(28)}</span>}
                    {showDescriptions && (
                      <p className={`text-slate-500 leading-relaxed line-clamp-2 ${getSizeClass('xs')} ${getAlignClass()}`} style={{ fontFamily: bodyFont }}>
                        Prime cut tenderloin with peppercorn reduction, asparagus, and truffle mash.
                      </p>
                    )}
                  </div>
                  <button 
                    className="mt-2 text-xs font-semibold px-3 py-2 rounded-xl w-full flex items-center justify-center gap-1 transition-all hover:opacity-90 text-white shadow-sm" 
                    style={{ backgroundColor: accentColor, fontFamily: headingFont }}
                  >
                    Add Item
                  </button>
                </div>
              </div>
            )}

            {layout !== 'grid' && layout !== 'classic' && (
              <div className={`bg-white p-3.5 rounded-2xl shadow-sm border border-slate-100 flex transition-transform hover:-translate-y-0.5 duration-300 gap-4`}>
                <div className="flex-1 space-y-1.5 flex flex-col justify-between py-1">
                  <div>
                    <div className={`flex ${getPriceAlignClass()} w-full mb-1`}>
                      <h4 className={`font-bold text-slate-900 leading-tight pr-2 ${getSizeClass('sm')}`} style={{ fontFamily: headingFont }}>Chef's Special Filet</h4>
                      {menuAlignment !== 'center' && <span className={`font-bold shrink-0 transition-colors duration-500 ${getSizeClass('sm')}`} style={{ color: accentColor, fontFamily: bodyFont }}>{formatPrice(28)}</span>}
                    </div>
                    {menuAlignment === 'center' && <span className={`font-bold block mb-1 transition-colors duration-500 ${getSizeClass('sm')}`} style={{ color: accentColor, fontFamily: bodyFont }}>{formatPrice(28)}</span>}
                    {showDescriptions && (
                      <p className={`text-slate-500 leading-relaxed line-clamp-2 ${getSizeClass('xs')} ${getAlignClass()}`} style={{ fontFamily: bodyFont }}>
                        Prime cut tenderloin with peppercorn reduction, asparagus, and truffle mash.
                      </p>
                    )}
                  </div>
                  <button 
                    className="mt-2 text-xs font-semibold px-3 py-2 rounded-xl w-full flex items-center justify-center gap-1 transition-all hover:opacity-90 text-white shadow-sm" 
                    style={{ backgroundColor: accentColor, fontFamily: headingFont }}
                  >
                    Add Item
                  </button>
                </div>
                <div className={`w-24 h-24 rounded-xl bg-slate-200 object-cover shrink-0 overflow-hidden shadow-inner border border-slate-100/50 `}>
                  <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Special Filet" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Analytics Insight */}
      <div className="mt-8 bg-blue-50 border border-blue-100 text-blue-800 p-4 w-full rounded-xl shadow-sm max-w-[360px] mx-auto text-center flex flex-col items-center gap-2">
        <div className="p-2 bg-blue-100 rounded-full text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
        </div>
        <div>
          <h5 className="text-sm font-bold">Marketing Insight</h5>
          <p className="text-xs text-blue-600/80 mt-0.5 font-medium leading-relaxed">Menus with high-quality images and structured layout receive 35% more engagement on average.</p>
        </div>
      </div>
    </div>
  );
}
