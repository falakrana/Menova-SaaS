import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useClerk, useUser } from "@clerk/react";
import {
  LayoutDashboard,
  FolderOpen,
  UtensilsCrossed,
  QrCode,
  Eye,
  Settings,
  Menu,
  X,
  LogOut,
  ChefHat,
  ClipboardList,
  AlertTriangle,
  Loader2,
  RefreshCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { title: "Categories", path: "/dashboard/categories", icon: FolderOpen },
  { title: "Menu Items", path: "/dashboard/items", icon: UtensilsCrossed },

  { title: "QR Code", path: "/dashboard/qr-code", icon: QrCode },
  { title: "Menu Preview", path: "/dashboard/preview", icon: Eye },
  { title: "Customization", path: "/dashboard/customization", icon: ChefHat },
  { title: "Profile", path: "/dashboard/profile", icon: Settings },
];

export default function DashboardLayout({
  children,
  headerActions,
}: {
  children: React.ReactNode;
  headerActions?: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const restaurant = useStore((s) => s.restaurant);
  const isLoading = useStore((s) => s.isLoading);
  const error = useStore((s) => s.error);
  const initialize = useStore((s) => s.initialize);
  const logout = useStore((s) => s.logout);
  const { signOut } = useClerk();
  const { user } = useUser();

  const displayName = user?.fullName || user?.firstName || user?.username || restaurant?.name || "User";
  const displayEmail = user?.primaryEmailAddress?.emailAddress || restaurant?.email || "";
  const userInitial = displayName.charAt(0).toUpperCase();

  if (!restaurant) {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="flex items-center gap-3 text-slate-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Loading dashboard...</span>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Dashboard failed to load</h2>
          <p className="text-sm text-slate-600 mb-5">
            {error || "We could not load your restaurant profile. Please try again."}
          </p>
          <button
            onClick={() => void initialize()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const isActive = (path: string) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
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
            <span className="font-display font-black text-xl text-primary tracking-tight leading-none mb-0.5">
              Menova
            </span>
            <span className="text-[10px] font-bold text-primary/80 uppercase tracking-widest leading-none">
              Restaurant SaaS
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto no-scrollbar relative">
        <p className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-sidebar-foreground/30">
          Main Menu
        </p>
        {navItems.map((item) =>
          item.disabled ? (
            <div
              key={item.path}
              className={cn(
                "flex items-center gap-3 px-3.5 py-3 rounded-2xl text-[13px] font-semibold transition-all duration-200 w-full text-left",
                "text-sidebar-foreground/20 cursor-not-allowed border border-transparent",
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
                "group relative flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-[13px] font-bold transition-all duration-300 border border-transparent",
                isActive(item.path)
                  ? "bg-primary text-white shadow-lg shadow-primary/35 scale-[1.02] border-primary/20"
                  : "text-sidebar-foreground/80 hover:bg-primary/10 hover:text-primary hover:border-primary/20",
              )}
            >
              <item.icon
                className={cn(
                  "w-[18px] h-[18px] transition-transform duration-300 group-hover:scale-110",
                  isActive(item.path)
                    ? "text-white"
                    : "text-sidebar-foreground/40 group-hover:text-primary",
                )}
              />
              <span>{item.title}</span>
              {isActive(item.path) && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full"
                />
              )}
            </Link>
          ),
        )}
      </nav>
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
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={() => setMobileOpen(false)}
            />
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
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all active:scale-95 shadow-sm"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden lg:flex flex-col">
              <h1 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none mb-1">
                Menova Admin
              </h1>
              <p className="text-xs font-bold text-slate-700">
                {navItems.find((i) => isActive(i.path))?.title || "Dashboard"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {headerActions && (
              <div className="flex items-center gap-3">{headerActions}</div>
            )}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="group flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/50 p-1.5 pr-4 shadow-sm backdrop-blur-xl ring-2 ring-transparent transition-all duration-300 hover:bg-white hover:shadow-md hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                    aria-label="Account menu"
                  >
                    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden shadow-sm transition-transform duration-300 group-hover:scale-105 bg-slate-100 border border-slate-200">
                      {user?.hasImage ? (
                        <img
                          src={user.imageUrl}
                          alt={displayName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center bg-slate-800 text-xs font-black text-white shadow-inner">
                          {userInitial}
                        </span>
                      )}
                    </div>
                    <div className="hidden flex-col items-start sm:flex">
                      <span className="text-[13px] font-bold text-slate-800 leading-tight">
                        {displayName.split(' ')[0]}
                      </span>
                      {restaurant?.name && (
                        <span className="text-[10px] font-semibold text-slate-400 leading-tight truncate max-w-[120px]">
                          {restaurant.name}
                        </span>
                      )}
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-1.5">
                      <p className="text-sm font-semibold leading-none text-foreground">
                        {displayName}
                      </p>
                      {displayEmail && (
                        <p className="text-xs text-muted-foreground leading-none">
                          {displayEmail}
                        </p>
                      )}
                      {restaurant?.name && restaurant.name !== displayName && (
                        <p className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground mt-1 pt-1 border-t border-border">
                          {restaurant.name}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
                    onClick={async () => {
                      logout();
                      await signOut();
                      navigate("/", { replace: true });
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
