import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FolderOpen, UtensilsCrossed, QrCode, Eye,
  Settings, Menu, X, LogOut, ChefHat, ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';

const navItems = [
  { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { title: 'Categories', path: '/dashboard/categories', icon: FolderOpen },
  { title: 'Menu Items', path: '/dashboard/items', icon: UtensilsCrossed },
  { title: 'Orders', path: '/dashboard/orders', icon: ClipboardList },
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

  if (!restaurant) return null;

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shadow-sm">
            <UtensilsCrossed className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg text-sidebar-accent-foreground tracking-tight">Menova</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
              isActive(item.path)
                ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-glow'
                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            )}
          >
            <item.icon className="w-[18px] h-[18px]" />
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border mt-auto">
        <div className="px-3 py-2 mb-2">
          <p className="text-xs font-semibold text-sidebar-accent-foreground truncate">{restaurant.name}</p>
          <p className="text-[10px] text-sidebar-foreground/60 truncate">{restaurant.email}</p>
        </div>
        <button
          onClick={() => useStore.getState().logout()}
          className="flex items-center gap-3 px-3 py-2 text-[13px] font-medium w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors rounded-lg"
        >
          <LogOut className="w-[17px] h-[17px]" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background font-sans overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-[260px] flex-col bg-sidebar border-r border-sidebar-border shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-sidebar z-50 animate-slide-in-left shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 bg-background/50 backdrop-blur-xl border-b border-border shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            {headerActions && (
              <div className="flex items-center gap-3">
                {headerActions}
              </div>
            )}
            <div className="h-8 w-[1px] bg-border mx-1 hidden sm:block" />
            <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground shadow-sm ring-4 ring-primary/10">
              {restaurant.name.charAt(0)}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-6 lg:p-10">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
