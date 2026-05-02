import { 
  UtensilsCrossed, Heart, ChevronLeft, ChevronRight, 
  Flame, Star, Search, Info, Plus, Minus, 
  Clock, MapPin, Phone, ArrowLeft, Share2
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { useLikesStore } from '@/store/useLikesStore';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import DefaultTemplate from '@/templates/DefaultTemplate';
import PremiumDark from '@/templates/PremiumDark';
import WarmRustic from '@/templates/WarmRustic';
import CleanCatering from '@/templates/CleanCatering';

export interface PublicMenuProps {
  previewData?: {
    restaurant: any;
    categories: any[];
    menuItems: any[];
  };
  embedded?: boolean;
  hideCart?: boolean;
  embeddedDevice?: 'mobile' | 'tablet';
}

const TemplateRegistry: Record<string, any> = {
  'standard': DefaultTemplate,
  'premium-dark': PremiumDark,
  'warm-rustic': WarmRustic,
  'clean-catering': CleanCatering,
};

export default function PublicMenu({ previewData, embedded = false, hideCart = false, embeddedDevice }: PublicMenuProps) {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [activeCat, setActiveCat] = useState('all');

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const { likedItems, toggleLike } = useLikesStore();

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
        if (previewData.categories.length > 0) {
          setActiveCat('all');
        }
        setLoading(false);
        return;
      }

      if (!id || id === 'demo') {
        setLoading(false);
        return;
      }
      try {
        const data = await api.getPublicMenu(id);
        setRestaurant(data.restaurant);
        setCategories(data.categories);
        setMenuItems(data.menuItems);
        if (data.categories.length > 0) setActiveCat('all');

        // Track view with 4-hour cooldown
        const viewKey = `menova_last_view_${id}`;
        const lastView = localStorage.getItem(viewKey);
        const now = Date.now();
        const fourHours = 4 * 60 * 60 * 1000;

        if (!lastView || (now - parseInt(lastView)) > fourHours) {
          api.trackMenuView(id).catch(err => console.error('Failed to track view:', err));
          localStorage.setItem(viewKey, now.toString());
        }
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

  const SelectedTemplate = TemplateRegistry[restaurant.templateId || 'standard'] || DefaultTemplate;

  const templateProps = {
    restaurant,
    categories,
    menuItems,
    activeCat,
    setActiveCat,
    likedItems,
    toggleLike,
    formatPrice,
    embedded
  };

  return <SelectedTemplate {...templateProps} />;
}
