import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FolderOpen, UtensilsCrossed, QrCode, Eye,
  Settings, Menu, X, LogOut, ChefHat, ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { title: 'Categories', path: '/dashboard/categories', icon: FolderOpen },
  { title: 'Menu Items', path: '/dashboard/items', icon: UtensilsCrossed },
  { title: 'Orders', path: '/dashboard/orders', icon: ClipboardList, disabled: true },
  { title: 'QR Code', path: '/dashboard/qr-code', icon: QrCode },
  { title: 'Menu Preview', path: '/dashboard/preview', icon: Eye },
  { title: 'Customization', path: '/dashboard/customization', icon: ChefHat },
  { title: 'Settings', path: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ 
  children, 
  headerActions 
}: { 
  children: React.ReactNode,
  headerActions?: React.ReactNode
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const restaurant = useStore((s) => s.restaurant);
  const logout = useStore((s) => s.logout);

  if (!restaurant) return null;

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar/95 backdrop-blur-3xl relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-40 h-40 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="p-6 relative">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-105 transition-all duration-300">
            <ChefHat className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-xl text-white tracking-tight leading-none mb-0.5">Menova</span>
            <span className="text-[10px] font-bold text-primary/80 uppercase tracking-widest leading-none">Restaurant SaaS</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar relative">
        <p className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-sidebar-foreground/30">Main Menu</p>
        {navItems.map((item) => (
          item.disabled ? (
            <div
              key={item.path}
              className={cn(
                'flex items-center gap-3 px-3.5 py-3 rounded-2xl text-[13px] font-semibold transition-all duration-200 w-full text-left',
                'text-sidebar-foreground/20 cursor-not-allowed border border-transparent',
              )}
            >
              <item.icon className="w-[18px] h-[18px] opacity-40" />
              <span>{item.title}</span>
              <span className="ml-auto text-[8px] font-black uppercase tracking-[0.1em] px-1.5 py-0.5 bg-white/5 rounded-md text-sidebar-foreground/20 border border-white/5">
                Soon
              </span>
            </div>
          ) : (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'group relative flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-[13px] font-bold transition-all duration-300 border border-transparent',
                isActive(item.path)
                  ? 'bg-primary text-white shadow-[0_8px_30px_rgb(249,115,22,0.35)] scale-[1.02] border-primary/20'
                  : 'text-sidebar-foreground/80 hover:bg-white/5 hover:text-white hover:border-white/5'
              )}
            >
              <item.icon className={cn(
                'w-[18px] h-[18px] transition-transform duration-300 group-hover:scale-110',
                isActive(item.path) ? 'text-white' : 'text-sidebar-foreground/40 group-hover:text-primary'
              )} />
              <span>{item.title}</span>
              {isActive(item.path) && (
                <motion.div 
                   layoutId="activeNav"
                   className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full" 
                />
              )}
            </Link>
          )
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 mt-auto relative bg-black/20">
        <div className="px-4 py-3 mb-3 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3 group cursor-pointer hover:bg-white/10 transition-all">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center font-black text-xs text-white">
            {restaurant.name.charAt(0)}
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-[11px] font-bold text-white truncate leading-none mb-1">{restaurant.name}</p>
            <p className="text-[9px] font-medium text-sidebar-foreground/50 truncate leading-none uppercase tracking-wider">{restaurant.email.split('@')[0]}</p>
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            navigate('/', { replace: true });
          }}
          className="flex items-center gap-3 px-4 py-3 text-[12px] font-bold w-full text-sidebar-foreground/60 hover:text-red-400 transition-all duration-300 rounded-2xl hover:bg-red-500/5 group"
        >
          <LogOut className="w-[17px] h-[17px] group-hover:-translate-x-1 transition-transform" />
          <span>Log Out Session</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-body text-slate-900 overflow-hidden text-sm">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-[280px] flex-col bg-[#020617] shrink-0 z-50">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] lg:hidden"
          >
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setMobileOpen(false)} />
            <motion.aside 
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-[#020617] z-[101] shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <header className="h-16 flex items-center justify-between px-6 lg:px-10 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 shrink-0 z-40 sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all active:scale-95 shadow-sm">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden lg:flex flex-col">
               <h1 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none mb-1">Menova Admin</h1>
               <p className="text-xs font-bold text-slate-700">{navItems.find(i => isActive(i.path))?.title || "Dashboard"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {headerActions && (
              <div className="flex items-center gap-3">
                {headerActions}
              </div>
            )}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="flex flex-col text-right hidden sm:flex">
                <span className="text-xs font-black text-slate-900 leading-none mb-0.5">{restaurant.name}</span>
                <span className="text-[10px] font-bold text-slate-400 leading-none uppercase tracking-tighter">Pro Store</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-[#F1F5F9] border border-slate-200 flex items-center justify-center p-0.5 shadow-sm ring-2 ring-transparent transition-all hover:ring-primary/20">
                 <div className="w-full h-full rounded-[14px] gradient-primary flex items-center justify-center text-sm font-black text-white">
                    {restaurant.name.charAt(0)}
                 </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-6 lg:p-12 custom-scrollbar">
          <div className="max-w-[1400px] mx-auto animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
