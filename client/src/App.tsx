import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import EnhancedLanding from "@/pages/EnhancedLanding";
import RenterDashboard from "@/pages/RenterDashboard";
import LandlordDashboard from "@/pages/LandlordDashboard";
import RenterOnboarding from "@/pages/RenterOnboarding";
import RenterProfileCard from "@/pages/RenterProfileCard";
import BrowseListings from "@/pages/BrowseListings";
import LandlordListings from "@/pages/LandlordListings";
import LandlordApplications from "@/pages/LandlordApplications";
import RenterSubscription from "@/pages/RenterSubscription";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import CustomCursor from "./components/CustomCursor";
import SmoothScroll from "./components/SmoothScroll";
import LoadingScreen from "./components/LoadingScreen";
import ScrollProgress from "./components/ScrollProgress";
import FloatingButton from "./components/FloatingButton";
import PageTransition from "./components/PageTransition";

function Router() {
  return (
    <Switch>
      <Route path="/" component={EnhancedLanding} />
      <Route path="/home" component={Home} />
      <Route path="/renter/dashboard" component={RenterDashboard} />
      <Route path="/renter/onboarding" component={RenterOnboarding} />
      <Route path="/renter/profile" component={RenterProfileCard} />
      <Route path="/renter/listings" component={BrowseListings} />
      <Route path="/renter/subscription" component={RenterSubscription} />
      <Route path="/landlord/dashboard" component={LandlordDashboard} />
      <Route path="/landlord/listings" component={LandlordListings} />
      <Route path="/landlord/applications" component={LandlordApplications} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
      >
        <TooltipProvider>
          <Toaster />
          <CustomCursor />
          <SmoothScroll />
          <LoadingScreen />
          <ScrollProgress />
          <FloatingButton />
          <PageTransition>
            <Router />
          </PageTransition>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
