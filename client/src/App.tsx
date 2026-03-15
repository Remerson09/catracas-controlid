import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import CatracasDashboardLayout from "./components/CatracasDashboardLayout";
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import Users from "./pages/Users";
import Settings from "./pages/Settings";

function DashboardRoute() {
  return (
    <CatracasDashboardLayout>
      <Dashboard />
    </CatracasDashboardLayout>
  );
}

function DevicesRoute() {
  return (
    <CatracasDashboardLayout>
      <Devices />
    </CatracasDashboardLayout>
  );
}

function UsersRoute() {
  return (
    <CatracasDashboardLayout>
      <Users />
    </CatracasDashboardLayout>
  );
}

function SettingsRoute() {
  return (
    <CatracasDashboardLayout>
      <Settings />
    </CatracasDashboardLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={DashboardRoute} />
      <Route path="/devices" component={DevicesRoute} />
      <Route path="/users" component={UsersRoute} />
      <Route path="/settings" component={SettingsRoute} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
