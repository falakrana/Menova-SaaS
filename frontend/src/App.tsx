import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import MenuItemsPage from "./pages/MenuItemsPage";
import QRCodePage from "./pages/QRCodePage";
import MenuPreview from "./pages/MenuPreview";
import CustomizationPage from "./pages/CustomizationPage";
import SettingsPage from "./pages/SettingsPage";
import PublicMenu from "./pages/PublicMenu";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import NotFound from "./pages/NotFound";

import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";

const queryClient = new QueryClient();

const App = () => {
  const initialize = useStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/menu/:id" element={<PublicMenu />} />
            <Route path="/menu/demo" element={<PublicMenu />} />
            <Route path="/cart" element={<CartPage />} />

            {/* Protected Dashboard Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/categories" element={<Categories />} />
              <Route path="/dashboard/items" element={<MenuItemsPage />} />
              <Route path="/dashboard/orders" element={<OrdersPage />} />
              <Route path="/dashboard/qr-code" element={<QRCodePage />} />
              <Route path="/dashboard/preview" element={<MenuPreview />} />
              <Route path="/dashboard/customization" element={<CustomizationPage />} />
              <Route path="/dashboard/settings" element={<SettingsPage />} />
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
