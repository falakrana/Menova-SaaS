import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { useEffect, useRef } from "react";

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


import NotFound from "./pages/NotFound";

import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import { useStore } from "@/store/useStore";
import { setClerkTokenGetter } from "@/lib/api";

const queryClient = new QueryClient();

/**
 * Listens to Clerk's auth state and syncs it with the app store.
 * – When signed in: registers the Clerk token getter and fetches restaurant data.
 * – When signed out: clears app state.
 */
function AuthSyncProvider() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const initialize = useStore((s) => s.initialize);
  const logout = useStore((s) => s.logout);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      setClerkTokenGetter(() => getToken());
      if (!initializedRef.current) {
        initializedRef.current = true;
        initialize();
      }
    } else {
      initializedRef.current = false;
      logout();
    }
  }, [isLoaded, isSignedIn]);

  return null;
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ErrorBoundary>
          <BrowserRouter>
            <AuthSyncProvider />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/menu/:id" element={<PublicMenu />} />
              <Route path="/menu/demo" element={<PublicMenu />} />


              {/* Protected Dashboard Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/categories" element={<Categories />} />
                <Route path="/dashboard/items" element={<MenuItemsPage />} />

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
