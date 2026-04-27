import { useAuth } from "@clerk/react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useStore } from "@/store/useStore";

export default function ProtectedRoute() {
  const { isLoaded, isSignedIn } = useAuth();
  const { isLoading, hasInitialized, restaurant } = useStore();
  const location = useLocation();

  // Wait for Clerk to finish loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="h-12 w-56 animate-pulse rounded-lg bg-muted" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="h-36 animate-pulse rounded-xl bg-muted" />
            <div className="h-36 animate-pulse rounded-xl bg-muted" />
            <div className="h-36 animate-pulse rounded-xl bg-muted" />
          </div>
          <div className="h-80 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Wait for store initialization to complete
  if (!hasInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="h-12 w-56 animate-pulse rounded-lg bg-muted" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="h-36 animate-pulse rounded-xl bg-muted" />
            <div className="h-36 animate-pulse rounded-xl bg-muted" />
            <div className="h-36 animate-pulse rounded-xl bg-muted" />
          </div>
          <div className="h-80 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  const restaurantName = (restaurant?.name || "").trim();
  const onboardingComplete = restaurantName.length > 0;
  const isProfileRoute =
    location.pathname === "/dashboard/profile" ||
    location.pathname === "/dashboard/settings";

  if (!onboardingComplete && !isProfileRoute) {
    return <Navigate to="/dashboard/profile" replace />;
  }

  return <Outlet />;
}
