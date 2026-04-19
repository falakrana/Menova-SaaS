import { 
  UtensilsCrossed, Heart, ShoppingCart, ChevronLeft, ChevronRight, 
  Flame, Star, Search, Info, Plus, Minus, ShoppingBag, 
  Clock, MapPin, Phone, ArrowLeft, Share2
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';

export interface PublicMenuProps {
  previewData?: {
    restaurant: any;
    categories: any[];
    menuItems: any[];
  };
  /**
   * When rendering inside an admin preview panel, avoid full-screen layout,
   * extra bottom padding, and optional cart UI.
   */
  embedded?: boolean;
  hideCart?: boolean;
  /**
   * Force a fixed device type layout when embedded in a preview frame.
   * This is useful because Tailwind breakpoints are based on browser viewport,
   * not the preview container width.
   */
  embeddedDevice?: 'mobile' | 'tablet' | 'desktop';
}

// Dietary Icons Small Helper
const DietaryIcons = ({ item }: { item: any }) => (
  <div className="flex items-center gap-1.5 shrink-0 mt-1">
    {item.isVeg && (
      <div className="w-3.5 h-3.5 rounded-sm border border-green-600 flex items-center justify-center p-[2px]">
        <div className="w-full h-full rounded-full bg-green-600" />
      </div>
    )}
    {item.isSpicy && <Flame className="w-4 h-4 text-orange-500 fill-current" />}
    {item.isGlutenFree && (
      <div className="px-1 py-0.5 rounded-sm bg-blue-100 text-blue-800 text-[7px] font-black uppercase tracking-tighter border border-blue-200">
        GF
      </div>
    )}
    {item.specifications?.map((spec: string) => (
      <div key={spec} className="px-1 py-0.5 rounded-sm bg-slate-100 text-slate-600 text-[7px] font-black uppercase tracking-tighter border border-slate-200">
        {spec}
      </div>
    ))}
  </div>
);

export default function PublicMenu({ previewData, embedded = false, hideCart = false, embeddedDevice }: PublicMenuProps) {
  const { id } = useParams();
  const { cart, addToCart, updateCartQuantity, tableNumber, setTableNumber } = useStore();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [activeCat, setActiveCat] = useState('');
  const [showTableEntry, setShowTableEntry] = useState(false);
  const [tableInput, setTableInput] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [likedItems, setLikedItems] = useState<string[]>(() => {
    const saved = localStorage.getItem('menova_liked_items');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleLike = async (itemId: string) => {
    const isLiked = likedItems.includes(itemId);
    const newLiked = isLiked 
      ? likedItems.filter(id => id !== itemId)
      : [...likedItems, itemId];
    
    setLikedItems(newLiked);
    localStorage.setItem('menova_liked_items', JSON.stringify(newLiked));
    
    try {
      await api.likeMenuItem(itemId, !isLiked);
    } catch (err) {
      console.error('Failed to toggle like:', err);
      setLikedItems(likedItems);
      localStorage.setItem('menova_liked_items', JSON.stringify(likedItems));
    }
  };

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 5);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    async function loadMenu() {
      if (previewData) {
        setRestaurant(previewData.restaurant);
        setCategories(previewData.categories);
        setMenuItems(previewData.menuItems);
        if (previewData.categories.length > 0 && !activeCat) {
          setActiveCat(previewData.categories[0].id);
        }
        setLoading(false);
        return;
      }

      if (!id || id === 'demo') {
        // Fallback or demo mode - for now just stay loading or show error
        setLoading(false);
        return;
      }
      try {
        const data = await api.getPublicMenu(id);
        setRestaurant(data.restaurant);
        setCategories(data.categories);
        setMenuItems(data.menuItems);
        if (data.categories.length > 0) setActiveCat(data.categories[0].id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, [id, previewData]);

  useEffect(() => {
    checkScroll();
    const current = scrollRef.current;
    if (current) {
      current.addEventListener('scroll', checkScroll);
      return () => current.removeEventListener('scroll', checkScroll);
    }
  }, [categories, loading]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading menu...</div>;
  if (!restaurant) return <div className="min-h-screen flex items-center justify-center">Restaurant not found</div>;

  const filteredItems = menuItems.filter((i) => i.categoryId === activeCat && i.available);
  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);
  const cartTotal = cart.reduce((s, c) => s + c.menuItem.price * c.quantity, 0);

  const getCartQty = (itemId: string) => cart.find((c) => c.menuItem.id === itemId)?.quantity || 0;

  const currencySymbols: Record<string, string> = {
    'INR': '₹',
    'USD': '$',
    'EUR': '€',
    'GBP': '£'
  };

  const formatPrice = (price: number) => {
    const symbol = currencySymbols[restaurant.currency || 'INR'] || '₹';
    const format = restaurant.priceFormat || 'PREFIX_SPACE';

    switch (format) {
      case 'PREFIX': return `${symbol}${price}`;
      case 'PREFIX_SPACE': return `${symbol} ${price}`;
      case 'SUFFIX': return `${price}${symbol}`;
      case 'SUFFIX_SPACE': return `${price} ${symbol}`;
      default: return `${symbol} ${price}`;
    }
  };

  if (showTableEntry) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm text-center"
        >
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors shadow-lg overflow-hidden"
            style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
          >
            {restaurant.logoUrl ? (
              <img src={restaurant.logoUrl} alt={restaurant.name} className="w-full h-full object-cover" />
            ) : (
              <UtensilsCrossed className="w-8 h-8" />
            )}
          </div>
          <h1 className="font-display text-2xl font-bold mb-2">{restaurant.name}</h1>
          {restaurant.tagline && <p className="text-muted-foreground text-sm mb-4 italic">"{restaurant.tagline}"</p>}
          <p className="text-muted-foreground text-xs mb-8">Enter your table number to start ordering</p>
          <Input
            type="number"
            placeholder="Table Number"
            value={tableInput}
            onChange={(e) => setTableInput(e.target.value)}
            className="text-center text-2xl font-display font-bold h-16 mb-4"
            min={1}
          />
          <Button
            className="w-full h-12 gradient-primary"
            style={{ backgroundColor: 'var(--primary-color)' }}
            disabled={!tableInput || Number(tableInput) < 1}
            onClick={() => {
              setTableNumber(Number(tableInput));
              setShowTableEntry(false);
            }}
          >
            View Menu
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className={`${embedded ? 'h-full min-h-0' : 'min-h-screen'} bg-background ${embedded ? 'pb-0' : 'pb-24'} transition-all`} 
      style={{ 
        fontFamily: restaurant.bodyFont || 'Inter, sans-serif',
        ['--primary-color' as any]: restaurant.themeColor || '#0f172a',
        ['--accent-color' as any]: restaurant.accentColor || '#f97316'
      }}
    >
      {/* Immersive Hero Header */}
      <div className="relative overflow-hidden min-h-[50vh] flex flex-col items-center justify-center px-4 py-16 transition-all duration-700">
        {/* Background Layer: Mesh Gradient + Noise */}
        <div className="absolute inset-0 z-0 bg-[var(--primary-color)]">
          <div className="absolute inset-0 opacity-40 mix-blend-overlay gradient-mesh animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute inset-0 noise-bg"></div>
          {/* Circular Glows */}
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[var(--accent-color)]/20 rounded-full blur-3xl"></div>
        </div>

        {/* Content Layer */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center max-w-2xl px-6"
        >
          <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center mx-auto mb-6 border border-white/20 shadow-2xl overflow-hidden animate-blur-in">
            {restaurant.logoUrl ? (
              <img src={restaurant.logoUrl} alt={restaurant.name} className="w-full h-full object-cover" />
            ) : (
              <UtensilsCrossed className="w-10 h-10 text-white" />
            )}
          </div>
          
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg mb-2" style={{ fontFamily: restaurant.fontStyle }}>
            {restaurant.name}
          </h1>
          
          {restaurant.tagline && (
            <p className="text-white/85 text-sm md:text-base font-medium tracking-wide border-y border-white/10 py-2 inline-block px-4 mx-auto" style={{ fontFamily: restaurant.fontStyle }}>
              {restaurant.tagline}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {tableNumber && (
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-xs font-semibold border border-white/10 shadow-sm transition-all hover:bg-white/20">
                Table {tableNumber}
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-xs font-semibold border border-white/10 shadow-sm transition-all hover:bg-white/20">
              {restaurant.location || "Online"}
            </span>
          </div>
        </motion.div>
        
        {/* Subtle Bottom Wave/Curve */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
      </div>

      {/* Modern Sticky Category Bar */}
      <div className="sticky top-0 z-30 bg-background/70 backdrop-blur-xl border-b border-border/50 flex items-center shadow-lg shadow-black/[0.02]">
        <AnimatePresence>
          {showLeftArrow && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={() => scroll('left')}
              className="absolute left-0 z-40 h-full w-12 bg-gradient-to-r from-background via-background/90 to-transparent flex items-center justify-start pl-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="bg-white/50 backdrop-blur-sm p-1 rounded-full border border-border shadow-sm">
                <ChevronLeft className="w-4 h-4" />
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        <div 
          ref={scrollRef}
          className="flex px-4 py-3 gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-1"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`px-6 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300 transform active:scale-95 ${
                activeCat === cat.id
                  ? 'bg-[var(--accent-color)] text-white shadow-lg shadow-[var(--accent-color)]/25 scale-105'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted border border-transparent'
              }`}
              style={{ fontFamily: restaurant.fontStyle }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {showRightArrow && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onClick={() => scroll('right')}
              className="absolute right-0 z-40 h-full w-12 bg-gradient-to-l from-background via-background/90 to-transparent flex items-center justify-end pr-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="bg-white/50 backdrop-blur-sm p-1 rounded-full border border-border shadow-sm">
                <ChevronRight className="w-4 h-4" />
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Menu items Section */}
      <div className={`max-w-7xl mx-auto px-4 py-8 lg:py-12 space-y-8 ${restaurant.menuAlignment === 'center' ? 'text-center' : ''} surface-elegant`}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-black tracking-tight" style={{ fontFamily: restaurant.fontStyle }}>
             {categories.find(c => c.id === activeCat)?.name || "Menu"}
          </h2>
          <div className="h-0.5 flex-1 bg-gradient-to-r from-border/50 via-border to-transparent ml-4 opacity-50"></div>
        </div>

        <AnimatePresence mode="wait">
          {activeCat === categories[0]?.id && filteredItems.some(i => i.likesCount > 4) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-6 mb-12"
            >
              <div className="flex items-center gap-3">
                 <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] border border-orange-200">
                    <Star className="w-3 h-3 fill-current" /> Signature Series
                 </div>
                     <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">Most liked by customer</h3>
              </div>
              
              <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x scroll-pl-1">
                {filteredItems.filter(i => i.likesCount > 4).map((item, idx) => (
                   <motion.div
                     key={`featured-${item.id}`}
                     initial={{ opacity: 0, scale: 0.9, x: 20 }}
                     animate={{ opacity: 1, scale: 1, x: 0 }}
                     transition={{ delay: idx * 0.1 }}
                     className="relative flex-shrink-0 w-[240px] h-[320px] rounded-[2.5rem] bg-slate-900 overflow-hidden shadow-2xl group cursor-pointer snap-start"
                     onClick={() => navigate(`/item/${item.id}`)}
                   >
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-40 transition-all duration-700" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                      
                      <div className="absolute bottom-6 left-6 right-6">
                         <div className="flex items-center gap-2 mb-2">
                           <span className="px-2 py-0.5 rounded-lg bg-primary text-white text-[8px] font-black uppercase tracking-widest">Featured</span>
                           <span className="text-white/60 text-[10px] font-black tracking-widest">₹{item.price}</span>
                         </div>
                         <h4 className="text-white font-display font-black text-xl leading-tight mb-4 group-hover:text-primary transition-colors">{item.name}</h4>
                          <button 
                             onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }}
                             className={`w-full py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 ${
                               likedItems.includes(item.id)
                                 ? 'bg-red-500 text-white'
                                 : 'bg-white text-black hover:bg-red-50 transition-colors'
                             }`}
                          >
                             <Heart className={`w-4 h-4 ${likedItems.includes(item.id) ? 'fill-current' : ''}`} />
                             {likedItems.includes(item.id) ? 'Liked' : 'Like'}
                          </button>
                      </div>
                   </motion.div>
                ))}
              </div>
            </motion.div>
          )}
          <motion.div
            key={activeCat}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={
              restaurant.layout === 'grid' || restaurant.layout === 'premium'
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
                : "flex flex-col gap-4 lg:gap-6 max-w-4xl mx-auto"
            }
          >
            {filteredItems.length === 0 ? (
              <div className="col-span-full text-center py-20 px-4 bg-white/50 backdrop-blur-sm rounded-[32px] border border-dashed border-border/60">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
                   <UtensilsCrossed className="w-8 h-8 text-muted-foreground/30" />
                </div>
                <p className="text-muted-foreground font-medium">No items available in this category.</p>
              </div>
            ) : (
              filteredItems.map((item, index) => {
                const qty = getCartQty(item.id);
                const layout = restaurant.layout || 'classic';
                const isHot = item.likesCount > 4;

                // 1. MINIMAL LAYOUT (No Image, Text Focused)
                if (layout === 'minimal') {
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group relative flex items-center justify-between p-6 rounded-3xl bg-white/50 backdrop-blur-sm border border-slate-100/50 hover:bg-white transition-all duration-300"
                    >
                      <div className="flex-1 min-w-0 pr-6 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-display font-black text-lg line-clamp-1 group-hover:text-primary transition-colors">{item.name}</h3>
                          {isHot && <Star className="w-3 h-3 text-orange-400 fill-current" />}
                          <DietaryIcons item={item} />
                        </div>
                        <p className="text-xs text-muted-foreground font-medium line-clamp-1">{item.description}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-display font-black text-xl tracking-tight shrink-0">{formatPrice(item.price)}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(item.id);
                          }}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 border ${
                            likedItems.includes(item.id) 
                              ? 'bg-red-500 border-red-400 text-white shadow-lg' 
                              : 'bg-muted/50 border-transparent text-muted-foreground hover:bg-white hover:text-red-500'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${likedItems.includes(item.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </motion.div>
                  );
                }

                // 2. CLASSIC LAYOUT (Small Horizontal Cards)
                if (layout === 'classic') {
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      className="group flex flex-col sm:flex-row rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden h-fit sm:h-44"
                    >
                      <div className="w-full sm:w-44 h-44 sm:h-full relative overflow-hidden shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-200">
                             <UtensilsCrossed size={40} />
                          </div>
                        )}
                        {isHot && <div className="absolute top-3 left-3 px-2 py-0.5 rounded-lg bg-orange-400 text-white text-[8px] font-black uppercase tracking-widest">Hot</div>}
                      </div>

                      <div className="flex-1 p-6 flex flex-col justify-between text-left">
                         <div>
                            <div className="flex items-start justify-between gap-4 mb-2">
                               <h3 className="font-display font-black text-xl group-hover:text-primary transition-colors leading-none">{item.name}</h3>
                               <DietaryIcons item={item} />
                            </div>
                            <p className="text-xs text-muted-foreground font-medium line-clamp-2 leading-relaxed mb-4">{item.description}</p>
                         </div>
                         <div className="flex items-center justify-between mt-auto">
                            <span className="font-display font-black text-2xl tracking-tight">{formatPrice(item.price)}</span>
                            <button
                               onClick={(e) => {
                                 e.stopPropagation();
                                 toggleLike(item.id);
                               }}
                               className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 border ${
                                 likedItems.includes(item.id) 
                                   ? 'bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/30' 
                                   : 'bg-slate-50 border-slate-100 text-muted-foreground hover:bg-white hover:text-red-500'
                               }`}
                            >
                               <Heart className={`w-5 h-5 ${likedItems.includes(item.id) ? 'fill-current' : ''}`} />
                            </button>
                         </div>
                      </div>
                    </motion.div>
                  );
                }

                // 3. GRID & PREMIUM LAYOUT (Vertical Cards)
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`group relative flex flex-col rounded-[2.5rem] border border-border/50 bg-white shadow-xl shadow-black/[0.02] hover:shadow-2xl transition-all duration-500 overflow-hidden ${
                      isHot ? 'ring-2 ring-[var(--accent-color)]/20 shadow-[var(--accent-color)]/5' : ''
                    } ${layout === 'premium' ? 'sm:scale-105 hover:scale-110' : ''}`}
                  >
                    {/* Item Image with Hover Zoom */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted/40 backdrop-blur-sm">
                           <UtensilsCrossed className="w-12 h-12 text-muted-foreground/10" />
                        </div>
                      )}
                      
                      {/* Floating Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {isHot && (
                           <span className="px-2.5 py-1 rounded-lg bg-[var(--accent-color)] text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                              Bestseller
                           </span>
                        )}
                      </div>
                      
                      </div>

                    {/* Content Section */}
                    <div className="flex-1 p-8 flex flex-col text-left">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 
                          className="font-display font-black text-xl leading-snug group-hover:text-[var(--primary-color)] transition-colors duration-300"
                          style={{ fontFamily: restaurant.fontStyle }}
                        >
                          {item.name}
                        </h3>
                        <DietaryIcons item={item} />
                      </div>
                      
                      {item.description && (
                        <p className="text-muted-foreground/80 font-medium text-xs mb-8 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                      
                      <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Price</span>
                          <span className="font-display font-black text-2xl text-foreground tracking-tighter">
                            {formatPrice(item.price)}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                           <button
                             onClick={(e) => {
                               e.stopPropagation();
                               toggleLike(item.id);
                             }}
                             className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border backdrop-blur-md ${
                               likedItems.includes(item.id) 
                                 ? 'bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/30' 
                                 : 'bg-slate-100 border-slate-200 text-muted-foreground hover:text-red-500 hover:bg-white'
                             }`}
                           >
                             <Heart className={`w-6 h-6 ${likedItems.includes(item.id) ? 'fill-current' : ''}`} />
                           </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Cart FAB */}
      {!hideCart && cartCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: -20, opacity: 1 }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none"
        >
          <div className="max-w-lg mx-auto pointer-events-auto">
            <Button
              className="w-full h-16 text-lg justify-between text-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] active:scale-[0.97] transition-all rounded-[1.5rem] border-0 px-6 overflow-hidden relative group"
              style={{ backgroundColor: 'var(--primary-color)' }}
              onClick={() => navigate('/cart')}
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-white/60 leading-none mb-1">Items In Cart</span>
                  <span className="font-bold">{cartCount} Dish{cartCount > 1 ? 'es' : ''} Selected</span>
                </div>
              </div>

              <div className="text-right relative z-10 flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60 leading-none mb-1 text-right">Total Price</span>
                <span className="font-display font-black text-2xl">{formatPrice(cartTotal)}</span>
              </div>
            </Button>
          </div>
        </motion.div>
      )}

      {/* Modern Footer */}
      {!embedded && (
        <div className="text-center py-16 px-4 bg-muted/10">
           <div className="w-20 h-0.5 bg-border mx-auto mb-8 opacity-40"></div>
           <p className="text-[10px] text-muted-foreground font-black tracking-[0.4em] uppercase">
              Powered by <span className="text-[#FF4A1D]">MENOVA</span> 2024
           </p>
           <p className="mt-4 text-muted-foreground/40 text-[9px] max-w-xs mx-auto line-clamp-1 italic">
              Digital Menu & Self Ordering System for Modern Restaurants
           </p>
        </div>
      )}
    </div>
  );
}
