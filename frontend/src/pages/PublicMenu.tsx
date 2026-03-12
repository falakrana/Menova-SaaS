import { UtensilsCrossed, Plus, Minus, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
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
  }
}

export default function PublicMenu({ previewData }: PublicMenuProps) {
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
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors shadow-lg"
            style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
          >
            {restaurant.logoUrl ? (
              <img src={restaurant.logoUrl} alt={restaurant.name} className="w-10 h-10 object-contain" />
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
      className="min-h-screen bg-background pb-24 transition-all" 
      style={{ 
        fontFamily: restaurant.bodyFont || 'Inter, sans-serif',
        ['--primary-color' as any]: restaurant.themeColor || '#0f172a',
        ['--accent-color' as any]: restaurant.accentColor || '#f97316'
      }}
    >
      {/* Header */}
      <div 
        className="px-4 py-8 text-center transition-colors shadow-sm"
        style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
      >
        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-3 border border-white/20">
          {restaurant.logoUrl ? (
            <img src={restaurant.logoUrl} alt={restaurant.name} className="w-10 h-10 object-contain" />
          ) : (
            <UtensilsCrossed className="w-8 h-8 text-white" />
          )}
        </div>
        <h1 className="font-display text-2xl font-bold text-white" style={{ fontFamily: restaurant.fontStyle }}>{restaurant.name}</h1>
        {restaurant.tagline && <p className="text-white/70 text-xs mt-1 font-medium tracking-wide uppercase" style={{ fontFamily: restaurant.fontStyle }}>{restaurant.tagline}</p>}
        <p className="text-white/60 text-[10px] mt-2 tracking-widest uppercase">
          {tableNumber ? `Table ${tableNumber} · ` : ''}
          {restaurant.location || "Online"}
        </p>
      </div>

      {/* Category tabs */}
      <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-md border-b border-border shadow-sm flex items-center">
        <AnimatePresence>
          {showLeftArrow && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={() => scroll('left')}
              className="absolute left-0 z-20 h-full px-2 bg-gradient-to-r from-card via-card/80 to-transparent flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        <div 
          ref={scrollRef}
          className="flex px-4 gap-1 overflow-x-auto no-scrollbar scroll-smooth flex-1"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-300 ${
                activeCat === cat.id
                  ? 'border-[var(--accent-color)] text-[var(--accent-color)]'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
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
              className="absolute right-0 z-20 h-full px-2 bg-gradient-to-l from-card via-card/80 to-transparent flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Menu items */}
      <div className={`max-w-lg lg:max-w-5xl mx-auto px-4 py-6 lg:py-8 space-y-4 ${restaurant.menuAlignment === 'center' ? 'text-center' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCat}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={restaurant.layout === 'grid' ? "grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6" : "space-y-4"}
          >
            {filteredItems.length === 0 ? (
              <div className="text-center py-20 px-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                   <UtensilsCrossed className="w-8 h-8 text-muted-foreground/30" />
                </div>
                <p className="text-muted-foreground text-sm">No items available in this category yet.</p>
              </div>
            ) : (
              filteredItems.map((item) => {
                const qty = getCartQty(item.id);
                const isMinimal = restaurant.layout === 'minimal';
                const isGrid = restaurant.layout === 'grid';
                const isPremium = restaurant.layout === 'premium';
                const isCenter = restaurant.menuAlignment === 'center';

                return (
                  <motion.div
                    key={item.id}
                    layout
                    className={`flex h-full ${isCenter || isGrid || isPremium ? 'flex-col' : 'gap-4'} ${isMinimal ? 'p-3' : 'p-4'} rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden`}
                  >
                    {!isMinimal && (
                      <div className={`${isCenter || isGrid || isPremium ? 'w-full h-44 mb-3' : 'w-24 h-24'} rounded-xl bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden border border-border/50`}>
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <UtensilsCrossed className="w-8 h-8 text-muted-foreground/20" />
                        )}
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0 w-full flex flex-col">
                      <div className={`flex ${isCenter || isGrid || isPremium ? 'flex-col gap-1' : 'items-start justify-between gap-2'}`}>
                        <h3 
                          className={`font-display font-bold ${restaurant.menuTextSize === 'lg' ? 'text-lg' : restaurant.menuTextSize === 'sm' ? 'text-xs' : 'text-base'}`}
                          style={{ fontFamily: restaurant.fontStyle }}
                        >
                          {item.name}
                        </h3>
                        <span 
                          className="font-display font-extrabold text-[var(--accent-color)] text-sm flex-shrink-0"
                          style={{ color: 'var(--accent-color)' }}
                        >
                          {formatPrice(item.price)}
                        </span>
                      </div>
                      {restaurant.showDescriptions !== false && item.description && (
                         <p className={`text-muted-foreground mt-1 line-clamp-2 ${restaurant.menuTextSize === 'sm' ? 'text-[10px]' : 'text-xs'}`}>{item.description}</p>
                      )}
                      
                      <div className={`mt-auto pt-4 flex items-center ${isCenter || isGrid || isPremium ? 'justify-start' : 'justify-end'}`}>
                        {qty === 0 ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-9 px-4 text-xs font-bold rounded-full hover:shadow-sm transition-all"
                            style={{ borderColor: 'var(--accent-color)', color: 'var(--accent-color)', fontFamily: restaurant.fontStyle }}
                            onClick={() => addToCart(item)}
                          >
                            <Plus className="w-3.5 h-3.5 mr-1.5" /> ADD
                          </Button>
                        ) : (
                          <div className="flex items-center gap-3 bg-secondary/50 p-1 rounded-full border border-border">
                            <button
                              onClick={() => updateCartQuantity(item.id, qty - 1)}
                              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-background transition-colors text-muted-foreground"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-display font-bold text-sm w-4 text-center">{qty}</span>
                            <button
                              onClick={() => addToCart(item)}
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-all shadow-sm active:scale-95"
                              style={{ backgroundColor: 'var(--accent-color)' }}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
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
      {cartCount > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 p-4 z-50 bg-gradient-to-t from-background via-background/90 to-transparent"
        >
          <div className="max-w-lg mx-auto">
            <Button
              className="w-full h-14 text-base justify-between text-white shadow-xl active:scale-[0.98] transition-all rounded-2xl border-0"
              style={{ backgroundColor: 'var(--primary-color)' }}
              onClick={() => navigate('/cart')}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold">{cartCount} item{cartCount > 1 ? 's' : ''}</span>
              </div>
              <span className="font-display font-bold text-lg">{formatPrice(cartTotal)}</span>
            </Button>
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <div className="text-center py-10 text-[10px] text-muted-foreground tracking-widest uppercase">
        Digital Menu by <span className="font-bold text-primary">MENOVA</span>
      </div>
    </div>
  );
}
