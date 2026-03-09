import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { BottomNav } from "@/components/BottomNav";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import ReportPage from "./pages/ReportPage";
import ReportsFeedPage from "./pages/ReportsFeedPage";
import PickupDashboardPage from "./pages/PickupDashboardPage";
import GovernmentDashboardPage from "./pages/GovernmentDashboardPage";
import NotificationsPage from "./pages/NotificationsPage";
import MapViewPage from "./pages/MapViewPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AreaAnalyticsPage from "./pages/AreaAnalyticsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <div className="max-w-lg mx-auto min-h-screen bg-background relative">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/report" element={<ReportPage />} />
              <Route path="/reports" element={<ReportsFeedPage />} />
              <Route path="/pickup" element={<PickupDashboardPage />} />
              <Route path="/dashboard" element={<GovernmentDashboardPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/map" element={<MapViewPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/area-analytics" element={<AreaAnalyticsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </div>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
